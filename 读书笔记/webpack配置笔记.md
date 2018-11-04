# webpack前端配置笔记 #
掘金小册《使用webpack定制前端开发环境》读书笔记

## 一、webpack的概念和基础使用 ##

    //全局安装webpack和webpack-cli
    npm i webpack webpack-cli -g
    
    //初始化项目
    npm init
    
    -S 保存为线上依赖
    -D 保存为开发中依赖
    
我们可以**把loader理解为一个转换器**，负责把某种文件格式的内容转换成webpack可以支持打包的模块。eg:vue-loader、css-loader、babel-loader...

模块代码转换的工作由loader来处理，**除此之外的其他任何工作都可以交由plugin来完成**。使用plugin，我们可以满足更多构建中特殊的需求。eg:使用uglifyjs-webpack-plugin压缩JS代码等

## 二、搭建基本的前端开发环境 ##

### 关联HTML ###

使用插件html-webpack-plugin关联html和js

    const HtmlWebpackPlugin = require("html-webpack-plugin");

    module.exports = {
      entry: {
	    index: './src/js/index.js',
	    foo3: './src/js/foo.js',
	    bar: './src/js/bar.js',
      },
      output: {
	    path: path.resolve(__dirname, 'dist'),//配置输出文件的路径
	    filename: 'js/[name]-[hash].js',//在output.path基础上配置输出文件的路径和文件名
	    hashDigestLength: 8 // 默认长度是20
      },
      plugins: [
    	new UglifyPlugin(),
	    new HtmlWebpackPlugin({
	      template: 'index.html',//配置文件模板
	      filename: 'html/index-[hash].html',//在output.path基础上配置输出文件的路径和文件名
	      chunks: ["index",'foo3']//默认导入所有chunks
	    })
      ]
	}

### 构建CSS ###

- **css-loader**负责解析CSS代码，主要是为了处理CSS中的依赖，例如 `@import` 和 `url()` 等引用外部文件的声明
- **style-loader**会将css-loader解析的结果转变成JS代码，运行时动态插入style标签在DOM中

<del>要想将CSS文件分离出来，我们可以使用插件`extract-text-webpack-plugin`。</del>

在webpack4.0及以上，使用插件`mini-css-extract-plugin`将CSS文件分离出来。

    module: {
	    rules: [
	      //会将CSS打包进JS中，并在页面中动态插入<style>
	      /*  {
	      test:/\.css$/,
	      include: [
	    path.resolve(__dirname, 'src')
	      ],
	      use: ['style-loader','css-loader']
	    }*/
	    
	      //在webpack4.0之后使用mini-css-extract-plugin将CSS从JS中提取出来
	      {
	    test: /\.css$/,
	    include: [
	      path.resolve(__dirname, 'src')
	    ],
	    use: [{
	      loader: MiniCssExtractPlugin.loader,
	      options: {
	    // you can specify a publicPath here
	    // by default it use publicPath in webpackOptions.output
	    // publicPath: '../'
	      }
	    }, 'css-loader']
	      },
	     {
	    test: /\.scss$/,
	    include: [
	      path.resolve(__dirname, 'src')
	    ],
	    use: [MiniCssExtractPlugin.loader, 'css-loader','sass-loader']
	      },
	    ]
  	}
	plugins: [
    	new UglifyPlugin(),
	    new MiniCssExtractPlugin({
	      // Options similar to the same options in webpackOptions.output
	      // both options are optional
	      filename: "css/[name]-[hash].css",//在output.path基础上配置输出文件的路径和文件名
	      // chunkFilename: "[id].css"   chunkFilename是未被列在entry中，却又需要被打包出来的文件命名配置，用于异步加载
	    }),
	    new HtmlWebpackPlugin({
	      template: 'index.html',//配置文件模板
	      filename: 'html/index-[hash].html',//在output.path基础上配置输出文件的路径和文件名
	      chunks: ["index",'foo3']//默认导入所有chunks
	    })
    ]




### 处理图片文件 ###

css-loader可以解析样式中用url()引用的文件路径，但是图片对应的jpg/png/gif等文件格式，webpack处理不了。

file-loader可以用于处理很多类型的文件，它的主要作用是直接输出文件，把构建后的文件路径返回。在module.rules中配置：

      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: "file-loader",
          options: {}
        }

### 使用babel ###


在module.rules中配置：

	{
        test: /\.jsx?/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: 'babel-loader'
      }

Babel的相关配置可以在目录下使用.babelIrc文件来处理。

### 启动静态服务 ###

在项目下安装webpack-dev-server，然后在package.json中添加启动命令dev：

      "scripts": {
	    "dev": "webpack-dev-server --mode development",
	    "start": "webpack --mode development",
	    "build": "webpack --mode production",
	    "test": "echo 'Error: no test specified' && exit 1"
      }

## 三、webpack如何解析代码模块路径 ##

Node 的模块解析规则：
- 解析相对路径
	1. 查找相对当前模块的路径下是否有对应文件或文件夹
	2. 是文件则直接加载（如果文件没有后缀会依次查找.js/.node/.json后缀）
	3. 是文件夹则继续查找文件夹下的 package.json 文件
	4. 有 package.json 文件则按照文件中 main 字段的文件名来查找文件(*resolve.mainFields*)
	5. 无 package.json 或者无 main 字段则查找 index.js 文件(*resolve.mainFiles*)
- 解析模块名
查找当前文件目录下，父级目录及以上目录下的 node_modules 文件夹，看是否有对应名称的模块
- 解析绝对路径（不建议使用）
直接查找对应路径的文件

webpack 中有一个很关键的模块 enhanced-resolve 处理依赖模块路径的解析。在 webpack 配置中，和模块路径解析相关的配置都在 resolve 字段下：

```javascript
module.exports = {
  resolve: {
    // ...
  }
}
```

### resolve.alias

假设我们有个 utils 模块极其常用，经常编写相对路径很麻烦，希望可以直接 import 'utils' 来引用，那么我们可以配置某个模块的别名，如：

```javascript
alias: {
  utils: path.resolve(__dirname, 'src/utils') // 这里使用 path.resolve 和 __dirname 来获取绝对路径
}
```

上述的配置是模糊匹配，意味着只要模块路径中携带了 utils 就可以被替换掉，如：
```javascript
import 'utils/query.js' // 等同于 import '[项目绝对路径]/src/utils/query.js'
```

如果需要进行精确匹配可以使用：
```javascript
alias: {
  utils$: path.resolve(__dirname, 'src/utils') // 只会匹配 import 'utils'
}
```

### resolve.extensions

```javascript
extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
// 这里的顺序代表匹配后缀的优先级，例如对于 index.js 和 index.jsx，会优先选择 index.js
```
这个配置可以定义在进行模块路径解析时，webpack 会尝试帮你补全那些后缀名来进行查找。

### resolve.mainFields

有 package.json 文件则按照文件中 main 字段的文件名来查找文件
