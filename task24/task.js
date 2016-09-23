window.onload = function() {

    var $ = function(id) {

        return document.querySelector(id);
    }

   var box=$(".box");
   var delBtn=$("#delBtn");
   var addBtn=$("#addBtn");
   var input=$("#input");

   var selectedNode=null;

   box.addEventListener("click",function(e){

        selectedNode&&(selectedNode.classList.remove("selected"));
        selectedNode=e.target;
        selectedNode.classList.add("selected");

   })

   delBtn.addEventListener("click",function(){

        var parent=selectedNode.parentNode;
        parent.removeChild(selectedNode);
   })

   addBtn.addEventListener("click",function(){

        var value=input.value;

        if(!value){
            alert("请输入节点名称");
            return;
        }
        addNode(selectedNode,value);
   })

   function addNode(node,value){

        var div=document.createElement('div');
        div.innerHTML=value;
        node.appendChild(div);
   }


}
