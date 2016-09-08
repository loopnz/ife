window.onload=function(){

	var $=function(id){

		return document.querySelector(id);
	}

	function createTree(element){
		var root=null;
		if(element){
			root=new Node(element);
			var children=element.children;
			for(var i=0;i<children.length;i++){
				var node=createTree(children[i]);
				node.parent=root;
				root.children.push(node);
			}
		}

		return root;

	}

	function Node(element,parent){
		this.element=element;
		this.value=element.firstChild.nodeValue.trim();
		this.parent=null;
		this.children=[];
	}

	var tree=createTree($(".box"));
	var currentNode=null;
	
	function breadth(tree){
		var i=0;
		var stack=[];
		stack.push(tree);
		var cnode;
		while(stack.length>0){

			cnode=stack.shift();
			deal(cnode,i++);
			if(keyword==item.value){
				break;
			}
			for(var j=0;j<cnode.children.length;j++){
				stack.push(cnode.children[j])
			}

		}

	}
	function depth(tree,keyword){
		var i=0;
		deal(tree,i++);
		var stack=[];
		for(var i=0;i<tree.children.length;i++){
			stack.push(tree.children[i])
		}
		while(stack.length>0){
			var item=stack.shift();
			deal(item,i++,keyword);
			if(keyword==item.value){
				break;
			}
			stack=item.children.concat(stack);
		}
	}


	function deal(node,num,keyword){

		setTimeout(function(){
			console.log(node.value);
			if(currentNode){
				currentNode.element.classList.remove("blue");
			}
			node.element.classList.add("blue");
			currentNode=node;
			if(node.value===keyword){
				node.element.classList.remove("blue");
				node.element.classList.add("red");
			}
			
		},500*num)
	}

	$("#breadth").addEventListener("click",function(){
		breadth(tree);
	},false)
	$("#depth").addEventListener("click",function(){
		depth(tree);
	},false)

	var searchBtn=document.getElementById('searchBtn');
	var input=document.getElementById('input');


	searchBtn.addEventListener("click",function(){
		var value=input.value.trim();

		depth(tree,value);

	},false)


}