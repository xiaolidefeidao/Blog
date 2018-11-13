# webpack前端配置笔记 #

小册《使用webpack定制前端开发环境》读书笔记，相关示例请点击[这里](https://github.com/xiaolidefeidao/webpack_config_lesson)。

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


## 四、配置 loader ##

### 规则条件配置 ###

- { test: ... } 匹配特定条件
- { include: ... } 匹配特定路径
- { exclude: ... } 排除特定路径
- { and: [...] }必须匹配数组中所有条件
- { or: [...] } 匹配数组中任意一个条件
- { not: [...] } 排除匹配数组中所有条件

上述的所谓条件的值可以是：

- 字符串：必须以提供的字符串开始，所以是字符串的话，这里我们需要提供绝对路径
- 正则表达式：调用正则的 test 方法来判断匹配
- 函数：(path) => boolean，返回 true 表示匹配
- 数组：至少包含一个条件的数组
- 对象：匹配所有属性值的条件

示例：

    rules: [
	  {
	    test: /\.jsx?/, // 正则
	    include: [
	      path.resolve(__dirname, 'src'), // 字符串，注意是绝对路径
	    ], // 数组
	    // ...
	  },
	  {
	    test: {
	      js: /\.js/,
	      jsx: /\.jsx/,
	    }, // 对象，不建议使用
	    not: [
	      (value) => { /* ... */ return true; }, // 函数，通常需要高度自定义时才会使用
	    ],
	  },
	],

### 使用 loader 配置 ###

use字段为数组，则从右向左执行，示例：

    rules: [
      {
	    test: /\.less/,
	    use: [
	      'style-loader', // 直接使用字符串表示 loader
	      {
		    loader: 'css-loader',
		    options: {
		      importLoaders: 1
		    },
	      }, // 用对象表示 loader，可以传递 loader 配置等
	      {
		    loader: 'less-loader',
		    options: {
		      noIeCompat: true
	    }, // 传递 loader 配置
	      },
	    ],
	  },
    ],

### loader 应用顺序 ###

看一份这样的配置：

    rules: [
      {
	    test: /\.js$/,
	    exclude: /node_modules/,
	    loader: "eslint-loader",
      },
      {
	    test: /\.js$/,
	    exclude: /node_modules/,
	    loader: "babel-loader",
      },
    ],

所有的 loader 按照前置 -> 行内 -> 普通 -> 后置的顺序执行。所以当我们要确保 eslint-loader 在 babel-loader 之前执行时，可以如下添加 `enforce` 配置：

    rules: [
      {
	    enforce: 'pre', // 指定为前置类型
	    test: /\.js$/,
	    exclude: /node_modules/,
	    loader: "eslint-loader",
      },
    ]

### 使用 noParse ###

对于一些不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度。

> 使用 noParse 进行忽略的模块文件中不能使用 import、require、define 等导入机制；可以与 ProvidePlugin 结合使用。

	module.exports = {
	  // ...
	  module: {
	    noParse: /jquery|lodash/, // 正则表达式
	
	    // 或者使用 function
	    noParse(content) {
	      return /jquery|lodash/.test(content)
	    },
	  }
	}

## 五、使用 plugin ##

### DefinePlugin ###

这个插件用于创建一些在编译时可以配置的全局常量，这些常量的值我们可以在 webpack 的配置中去指定，例如：

    module.exports = {
      // ...
      plugins: [
	    new webpack.DefinePlugin({
	      PRODUCTION: JSON.stringify(true), // const PRODUCTION = true
	      VERSION: JSON.stringify('5fa3b9'), // const VERSION = '5fa3b9'
	      BROWSER_SUPPORTS_HTML5: true, // const BROWSER_SUPPORTS_HTML5 = 'true'
	      TWO: '1+1', // const TWO = 1 + 1,
	      CONSTANTS: {
	    	APP_VERSION: JSON.stringify('1.1.2') // const CONSTANTS = { APP_VERSION: '1.1.2' }
	      }
    }),
      ],
    }

### copy-webpack-plugin ###

我们一般会把开发的所有源码和资源文件放在 src/ 目录下，构建的时候产出一个 build/ 目录，通常会直接拿 build 中的所有文件来发布。有些文件没经过 webpack 处理，但是我们希望它们也能出现在 build 目录下，这时就可以使用 CopyWebpackPlugin 来处理了。

const CopyWebpackPlugin = require('copy-webpack-plugin')

    module.exports = {
      // ...
      plugins: [
	    new CopyWebpackPlugin([
	      { from: 'src/file.txt', to: 'build/file.txt', }, // 顾名思义，from 配置来源，to 配置目标路径
	      { from: 'src/*.ico', to: 'build/*.ico' }, // 配置项可以使用 glob
	      // 可以配置很多项复制规则
	    ]),
      ],
    }

### ProvidePlugin ###

该组件用于引用某些模块作为应用运行时的变量，从而不必每次都用 require 或者 import，其用法相对简单：

    new webpack.ProvidePlugin({
      identifier: 'module',
      _: 'lodash',
      $: 'jquery'
      // ...
    })

### IgnorePlugin ###

个插件用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去。例如我们使用 moment.js，直接引用后，里边有大量的 i18n 的代码，导致最后打包出来的文件比较大，而实际场景并不需要这些 i18n 的代码，这时我们可以使用 IgnorePlugin 来忽略掉这些代码文件，配置如下：

    module.exports = {
      // ...
      plugins: [
    	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
      ]
    }

## 六、webpack-dev-server 的使用 ##

package 中的 scripts 配置：

    {
      // ...
      "scripts": {
	    "dev": "webpack-dev-server --mode development"
      }
    }

配置devServer:

    module.exports = {
      // ...
      plugins: [
    	new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    	new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
      ]
      devServer: {
	    // proxy: {},
	    hot: true,//开启HMR
	    port: '8082',
	    before(app) {
	      mock(app) // 调用 mock 函数
    	}
      }
    }

`before` 在 webpack-dev-server 静态资源中间件处理之前，可以用于拦截部分请求返回特定内容，或者实现简单的数据 mock。

`after` 在 webpack-dev-server 静态资源中间件处理之后，比较少用到，可以用于打印日志或者做一些额外处理。

**常见的环境差异配置：**

- 生产环境可能需要分离 CSS 成单独的文件，以便多个页面共享同一个 CSS 文件
- 生产环境需要压缩 HTML/CSS/JS 代码
- 生产环境需要压缩图片
- 开发环境需要生成 sourcemap 文件
- 开发环境需要打印 debug 信息
- 开发环境需要 live reload 或者 hot reload 的功能

## 七、优化前端资源加载 ##

### 图片压缩 ###

使用 `image-webpack-loader` 压缩图片：

	{
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',//默认值为 file-loader ；图片大小大于 limit 时交由 fallback 指定的 loader 处理；options 中的配置会被传递给 fallback
              limit: 8192, // 单位是 Byte，当文件小于 8KB 时作为 DataURL 处理
              name: 'img/[name]-[hash].[ext]',
              publicPath: '../'
            },
          }, {
            //压缩图片
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { // 压缩 jpeg 的配置
                progressive: true,
                quality: 65
              },
              optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                enabled: false,
              },
              pngquant: { // 使用 imagemin-pngquant 压缩 png
                quality: '65-90',
                speed: 4
              },
              gifsicle: { // 压缩 gif 的配置
                interlaced: false,
              },
              webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                quality: 75
              },
            }
          }
        ],
      }

### 代码压缩 ###

webpack 4.x 版本运行时，mode 为 production 即会启动压缩 JS 代码的插件

webpack 3.x 版本使用 uglifyjs-webpack-plugin 压缩 JS 代码

`html-webpack-plugin` 插件可以帮助我们生成需要的 HTML 并对其进行压缩：

    module.exports = {
      // ...
      plugins: [
	    new HtmlWebpackPlugin({
	      filename: 'index.html', // 配置输出文件名和路径
	      template: 'assets/index.html', // 配置文件模板
	      minify: { // 压缩 HTML 的配置
	    	minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
	    	minifyJS: true // 压缩 HTML 中出现的 JS 代码
	      }
	    }),
      ],
    }

对于 CSS 文件，用来处理 CSS 文件的 css-loader提供了压缩 CSS 代码的功能：

    module.exports = {
      module: {
	    rules: [
	      // ...
	      {
	    test: /\.css/,
	    include: [
	      path.resolve(__dirname, 'src'),
	    ],
	    use: [
	      'style-loader',
	      {
	    loader: 'css-loader',
	    options: {
	      minimize: true, // 使用 css 的压缩功能
	    },
	      },
	    ],
	      },
	    ],
      }
    }

### 分离代码文件 ###

webpack 3.x 版本使用 CommonsChunkPlugin 配置 JS 代码分离；使用 extract-text-webpack-plugin 将 CSS 代码抽离出 JS

webpack 4.x 版本使用 optimization.splitChunks 配置 JS 代码分离；使用 mini-css-extract-plugin 将 CSS 代码抽离出 JS

使用 optimization.splitChunks 配置共享类库可以这么操作：

    module.exports = {
      entry: {
    	vendor: ["react", "lodash", "angular", ...], // 指定公共使用的第三方类库
      },
      optimization: {
	    splitChunks: {
	      cacheGroups: {
		    vendor: {
		      chunks: "initial",
		      test: "vendor",
		      name: "vendor", // 使用 vendor 入口作为公共部分
		      enforce: true,
		    },
	      },
	    },
      },
      // ... 其他配置
    }
    
    // 或者
    module.exports = {
      optimization: {
	    splitChunks: {
	      cacheGroups: {
		    vendor: {
		      test: /react|angluar|lodash/, // 直接使用 test 来做路径匹配
		      chunks: "initial",
		      name: "vendor",
		      enforce: true,
		    },
	      },
	    },
      },
    }
    
    // 或者
    module.exports = {
      optimization: {
	    splitChunks: {
	      cacheGroups: {
		    vendor: {
		      chunks: "initial",
		      test: path.resolve(__dirname, "node_modules") // 路径在 node_modules 目录下的都作为公共部分
		      name: "vendor", // 使用 vendor 入口作为公共部分
		      enforce: true,
		    },
	      },
	    },
      },
    }

### 按需加载模块 ###

在 webpack 的构建环境中，要按需加载代码模块很简单，遵循 ES 标准的动态加载语法 dynamic-import 来编写代码即可，webpack 会自动处理使用该语法编写的模块：

    // import 作为一个方法使用，传入模块名即可，返回一个 promise 来获取模块暴露的对象
    // 注释 webpackChunkName: "lodash" 可以用于指定 chunk 的名称，在输出文件时有用
    import(/* webpackChunkName: "lodash" */ 'lodash').then((_) => { 
      console.log(_.lash([1, 2, 3])) // 打印 3
    })

注意一下，如果你使用了 Babel 的话，还需要 babel-plugin-syntax-dynamic-import 这个 Babel 插件来处理 import() 这种语法。

由于动态加载代码模块的语法依赖于 promise，对于低版本的浏览器，需要添加 promise 的 polyfill 后才能使用。

示例：

    //index.js
    const ele = document.getElementById('span');
    
    ele.onclick = function () {
      import(/* webpackChunkName: "superalert" */'./superalert').then(({ default: superalert }) => {
    	superalert({ a: 1 })
      })
    };
    
    //superalert.js
    export default function superalert(chars) {
      if (typeof chars === 'string') {
    	alert(chars)
      } else {
    	alert(JSON.stringify(chars))
      }
    }
    
    //webpack.config.js
    module.exports = {
      entry: {
    	index: './src/js/index.js'
      }，
      output: {
		//在生产环境才能使用chunkhash，development 使用chunkhash会报错
	    filename: 'js/[name]-[chunkhash].js',//在output.path基础上配置输出文件的路径和文件名
	    chunkFilename: 'splitjs/[name]-[chunkhash].js',//动态加载的文件名
	    hashDigestLength: 8 // 默认长度是20
      },
    }

## 八、提升 webpack 的构建速度 ##

### 让 webpack 少干点活 ###

- 减少 resolve 的解析
- 把 loader 应用的文件范围缩小
- 减少 plugin 的消耗
- 换种方式处理图片

### 使用 DLLPlugin ###

使用插件 DLLPlugin 时需要额外的一个构建配置，用来打包公共的那一部分代码.

DLLPlugin 构建出来的内容无需每次都重新构建，后续应用代码部分变更时，你不用再执行配置为 webpack.dll.config.js 这一部分的构建，沿用原本的构建结果即可，所以相比 optimization.splitChunks，使用 DLLPlugin 时，构建速度是会有显著提高的。

DLLPlugin 的配置要麻烦得多，并且需要关心你公共部分代码的变化，当你升级 lodash（即你的公共部分代码的内容变更）时，要重新去执行 webpack.dll.config.js 这一部分的构建，不然沿用的依旧是旧的构建结果，使用上并不如 optimization.splitChunks 来得方便。这是一种取舍，根据项目的实际情况采用合适的做法。

html-webpack-plugin 并不会自动处理 DLLPlugin 分离出来的那个公共代码文件，我们需要自己处理这一部分的内容，可以考虑使用 add-asset-html-webpack-plugin
