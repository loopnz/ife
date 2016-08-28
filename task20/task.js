window.onload = function() {
    var $ = function(id) {
        return document.getElementById(id);
    }

    var eachObj = function(arr, fn) {
        for (var i = 0; i < arr.length; i++) {

            fn(arr[i]);
        }
    }

    var input = $("input");
    var left_in = $("left_in");
    var right_in = $("right_in");
    var left_out = $("left_out");
    var right_out = $("right_out");
    var box = $("box");

    var queue = [];
    var reg = /[^\s\.．。、，，，,]+/g;
    var renderObj = {

        "left": function(value) {
            var arr = value.match(reg);
            eachObj(arr, function(elem) {
                var element = new Elem(elem);
                queue.unshift(element);
                box.insertBefore(element.element, box.firstChild);
            })

        },
        "right": function(value) {
            var arr = value.match(reg);
            eachObj(arr, function(elem) {
                var element = new Elem(elem);
                queue.push(element);
                box.appendChild(element.element);
            })
        }
    }


    left_in.addEventListener('click', function() {
        var value = input.value;
        renderObj["left"](value);
    })
    right_in.addEventListener('click', function() {
        var value = input.value;
        renderObj["right"](value);
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
        this.element.innerHTML = value;
    }

    var search = $("search");
    var sin = $("sin");

    search.addEventListener("click", function() {

        var value = sin.value;
        var reg = "(.*)(" + value + ")(.*)";
        reg = new RegExp(reg);
        eachObj(queue, function(elem) {

            var html = elem.value;
            var arr = html.match(reg);
            if (!arr) {
                elem.element.innerHTML = html;
                return;
            }
            arr.shift();
            elem.element.innerHTML = "";
            eachObj(arr, function(str) {
                var node;
                if (str == value) {
                    node = document.createElement('span');
                    node.innerHTML = str;
                    node.style.color = "#fff";
                    node.style.backgroundColor = "blue";
                } else {
                    node = document.createTextNode(str);
                }
                elem.element.appendChild(node);
            })
        })

    }, false)



}
