var $ = function(id) {
    return document.getElementById(id);
}

var before = $("before");

var middle = $("middle");

var behind = $("behind");

var root = createTree($("root"));

before.addEventListener("click", function() {
    var fn = travel("before");
    fn(root);
}, false);
middle.addEventListener("click", function() {
    var fn = travel("middle");
    fn(root);
}, false);
behind.addEventListener("click", function() {
    var fn = travel("behind");
    fn(root);
}, false);




function travel(flag) {
	var fn;
    var i = 0;
    var currentNode = null;
    var over = function() {
        setTimeout(function() {
            currentNode.classList.remove("blue");
            currentNode = null;
            i = 0;
        }, 500);
    }
    var showNode=function(count,node){
    	 setTimeout(function() {
                    if (currentNode) {
                        currentNode.classList.remove("blue");
                    }
                    node.value.classList.add("blue");
                    currentNode = node.value;
                    if (count == i - 1) {
                        over();
                    }
                }, 500 * count)
    }
    if(flag=="before"){
    	fn = function(node) {
	        if (node != null) {
	           	showNode(i,node);
	            i++;
	            fn(node.left);
	            fn(node.right);
	        }
    	}
    }else if(flag=="middle"){
    	fn = function(node) {
	        if (node != null) {
	        	fn(node.left);
	           	showNode(i,node);
	            i++;
	            fn(node.right);
	        }
    	}
    }else if(flag=="behind"){
    	fn = function(node) {
	        if (node != null) {
	        	fn(node.left);
	            fn(node.right);
	           	showNode(i,node);
	            i++;
	        }
    	}
    }
   	
    return fn;
}

function Node(element) {
    this.value = element;
    this.left = null;
    this.right = null;
}

function createTree(element) {

    if (element) {
        var root = new Node(element);
        var children = root.value.children;
        if (children[0]) {
            root.left = createTree(children[0]);
        }
        if (children[1]) {
            root.right = createTree(children[1]);
        }

        return root;
    }
    return null;
}
