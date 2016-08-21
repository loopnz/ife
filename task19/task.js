window.onload = function() {
    var $ = function(id) {
        return document.getElementById(id);
    }

    var input = $("input");
    var left_in = $("left_in");
    var right_in = $("right_in");
    var left_out = $("left_out");
    var right_out = $("right_out");
    var box = $("box");

    var queue = [];

    left_in.addEventListener('click', function() {
        var value = input.value;
        if (!isNaN(parseInt(value))) {
            value = parseInt(value);
            if (value >= 10 && value <= 100) {
                var element = new Elem(value);
                queue.unshift(element);
                box.insertBefore(element.element, box.firstChild);
            } else {
                alert("数字超出范围");
            }

        }

    })
    right_in.addEventListener('click', function() {
        var value = input.value;
        if (!isNaN(parseInt(value))) {
            value = parseInt(value);
            if (value >= 10 && value <= 100) {
                var element = new Elem(value);
                queue.push(element);
                box.appendChild(element.element);
            } else {
                alert("数字超出范围");

            }
        }

    })
    left_out.addEventListener('click', function() {
        var element = queue.shift();
        box.removeChild(element.element);
        alert(element.value);
    })
    right_out.addEventListener('click', function() {
        var element = queue.pop();
        box.removeChild(element.element);
        alert(element.value);
    })

    box.addEventListener('click', function(e) {

        var target = e.target;
        if (target.className === "cell") {
            var idx = getIndex(target);
            var arr = queue.splice(idx, 1);
            box.removeChild(arr[0].element);
            alert(arr[0].value);
        }

    })


    function getIndex(elem) {

        var children = box.children;

        for (var i = 0; i < children.length; i++) {
            if (children[i] === elem) {
                return i;
            }
        }
        return -1;
    }

    function Elem(value) {
        this.value = value;
        this.element = document.createElement('div');
        this.element.className = "cell";
        this.element.style.height = value + "px";
    }


    function getNum(n,m){

    	return n+Math.floor(Math.random()*(m-n+1));

    }



    function getData(){
    	var arr=[];

    	for(var i=0;i<60;i++){
    		var num=getNum(10,100);
    		 var element = new Elem(num);
             queue.unshift(element);
            box.insertBefore(element.element, box.firstChild);
            arr.unshift(num);
    	}

    	return arr;

    }

    var arr=getData();

    $('quickSort').addEventListener("click",function(){

    	 var divs=$("box").children;
    	 quickSort(arr,0,arr.length-1,divs);
    })

   


    function quickSort(arr,left,right,divs){

    	var num;
    	if(left<right){
    		 num=partition(arr,left,right,divs);
    		 quickSort(arr,left,num-1,divs);
    		 quickSort(arr,num+1,right,divs);
    	}
    }

   var count=0;

  function partition(arr,left,right,divs){

  	var l,h,pivot,t;

  	pivot=arr[left];
  	l=left-1;
  	h=right+1;

  	while(l+1!=h){
  		if(arr[l+1]<=pivot){
  			l++;
  		}else if(arr[h-1]>pivot){
  			h--;
  		}else{
  			
  			t=arr[l+1];
  			arr[++l]=arr[h-1];
  			divs[l].style.height=arr[h-1]+"px";
  			divs[l].style.transition="all 0.3s "+(count++)*0.1+"s";
  			arr[--h]=t;
  			divs[h].style.height=t+"px";
  			divs[h].style.transition="all 0.3s "+(count++)*0.1+"s";
  		}
  	}
  	arr[left]=arr[l];
  	divs[left].style.height=arr[l]+"px";
  	divs[left].style.transition="all 0.3s "+(count++)*0.1+"s";
  	arr[l]=pivot;
  	divs[l].style.height=pivot+"px";
  	divs[l].style.transition="all 0.3s "+(count++)*0.1+"s";
  	return l;
  }


}
