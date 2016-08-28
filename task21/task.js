 var $ = function(id) {
     return document.getElementById(id);
 }
 var input = $("input");
 var tagbox = $("tagbox");
 var reg = /[^\s\.．。、，，，,]+/g;
 var queue = [];


 input.addEventListener("keyup", entry, false);
 tagbox.addEventListener("mouseover", over, false);
 tagbox.addEventListener("mouseout", out, false);
 tagbox.addEventListener("click", click, false);

 function click(e) {
     var target = e.target;
     var list = target.classList;
     if (list.contains("tag")) {
         var index = getIndex(tagbox, target);
         var element = queue[index];
         tagbox.removeChild(element.element);
         queue.splice(index, 1);
     }

 }

 function over(e) {

     var target = e.target;
     var list = target.classList;
     if (list.contains("tag")) {
         list.remove("blue");
         list.add("red");
         target.innerHTML = "删除" + target.innerHTML;
     }
 }

 function out(e) {
     var target = e.target;
     var list = target.classList;
     if (list.contains("tag")) {
         list.add("blue");
         list.remove("red");
         target.innerHTML = target.innerHTML.slice(2);
     }
 }

 function entry(e) {
     var tr = /^\s+|\s+$/;
     var code = e.which || e.keyCode;
     var value = this.value.replace(tr, "");
     if (!value) return;
     value = value.match(reg)[0];
     if (code == 188 || code == 13 || code == 32) {
         if (!has(value)) {
             var element = new Elem(value, "tag blue");
             queue.push(element);
             tagbox.appendChild(element.element);
             if (queue.length == 11) {
                 element = queue.shift();
                 tagbox.removeChild(element.element);
             }
         }
         this.value = "";
     }

 }

 function has(value) {
     for (var i = 0; i < queue.length; i++) {
         if (queue[i].value === value) {
             return true;
         }
     }
     return false;

 }

 function getIndex(box, elem) {

     var children = box.children;

     for (var i = 0; i < children.length; i++) {
         if (children[i] === elem) {
             return i;
         }
     }
     return -1;
 }


 function Elem(value, className) {
     this.value = value;
     this.element = document.createElement('div');
     this.element.className = className;
     this.element.innerHTML = value;
 }

 function unique(arr) {

     return arr.filter(function(elem, idx) {
         return arr.indexOf(elem) === idx;
     })
 }



 var btn = $("btn");
 var interestQueue = [];
 var interesArr = [];
 var txt = $("txt");
 var interestbox = $("interestbox");

 btn.addEventListener("click", function() {
     interestbox.innerHTML = "";
     var value = txt.value;
     var arr = value.match(reg);
     interesArr = interesArr.concat(arr);
     interesArr = unique(interesArr);
     if (interesArr.length > 10) {
         interesArr = interesArr.slice(interesArr.length - 10);
     }

     for (var i = 0; i < interesArr.length; i++) {

         var elem = new Elem(interesArr[i], "tag orange");
         interestQueue.push(elem);
         interestbox.appendChild(elem.element)
     }

 }, false)
