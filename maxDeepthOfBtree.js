'use strict'

//求一个二叉树的最大深度
function Solution(rootNode) {
    let num = 0;
    if (!rootNode) {
        return num;
    }

    function travel(node, level) {
        if (!node.right && !node.left) {
            num = Math.max(num, level);
            return;
        }
        if (node.left) travel(node.left, level + 1);
        if (node.right) travel(node.right, level + 1);
    }

    travel(rootNode, 1);
    return num;
}

/*测试二叉树：  1
            2    3
          4  5  6  7
        8            9
                   10 11  */
class Node {
    constructor(value, leftNode = undefined, rightNode = undefined) {
        this.value = value;
        this.left = leftNode;
        this.right = rightNode;
    }
}

let node11 = new Node(11), node10 = new Node(10), node9 = new Node(9, node10, node11),
    node8 = new Node(8), node7 = new Node(7, undefined, node9), node6 = new Node(6),
    node5 = new Node(5), node4 = new Node(4, node8), node3 = new Node(3, node6, node7),
    node2 = new Node(2, node4, node5), node1 = new Node(1, node2, node3);
console.time('solution');
console.log(Solution(node1));
console.timeEnd('solution');//solution: 0.600830078125ms

