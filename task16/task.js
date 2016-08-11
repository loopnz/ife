window.onload = function() {

    var util = {

        getSelector: function(dom) {
            if (dom.id) {
                return "#" + dom.id;
            } else if (dom.className) {
                return "." + dom.className.split(" ").join(".");
            } else if (dom.nodeType == 9) {
                return "body";
            } else {
                return dom.tagName.toLowerCase();
            }
        },
        matchSelector: (function() {

            var match = document.body.matchesSelector || document.body.webkitMatchesSelector || function(selector) {
                var elems = document.querySelectorAll(selector);
                for (var i = 0; i < elems.length; i++) {
                    if (elems[i] === this) {
                        return true;
                    }
                }
                return false;
            }
            return function(dom, selector) {
                return match.call(dom, selector);
            }

        })(),
        getTarget: function(dom, selector) {

            while (!this.matchSelector(dom, selector)) {
                dom = dom.parentNode;
            }
            return dom;
        },
        isChild: function(dom, selector) {
            return this.matchSelector(dom, selector);
        }

    }

    var addEvent = function(dom, ev, selector, callback) {

        if (typeof selector === "function") {
            callback = selector;
            selector = void 0;
            return dom.addEventListener(ev, callback, false);
        }
        var handler = function(event) {
            var target = event.target;
            var domSelector = util.getSelector(dom) + " " + selector;
            var childSelector = util.getSelector(dom) + " " + selector + " " + target.tagName;
            var isMatch = util.matchSelector(target, domSelector);
            var ischild = util.isChild(target, childSelector);
            if (isMatch) {
                callback.apply(target, arguments);
            }
            if (ischild) {
                var elem = util.getTarget(target, domSelector);
                callback.apply(elem, arguments);
            }

        }
        callback.proxy = handler;
        dom.addEventListener(ev, handler, false);

    }

   
    var validate={
    	validCity:function(value){
    		var r=/^[a-zA-z\u4e00-\u9fa5]{2,8}$/;
    		if(!r.test(value)){
    			return "城市格式不正确,正确为中英文长度2-8";
    		}

    	},
    	validAir:function(value){
    		var r=parseInt(value);
    		if(isNaN(r)){
    			return "空气质量必须输入整数";
    		}
    	}
    }

    var cityInput = document.getElementById("aqi-city-input");
    var valueInput = document.getElementById("aqi-value-input");
    var table = document.getElementById("aqi-table");
    var btn = document.getElementById("add-btn");


     var aqiData = {};
    /**
     * 从用户输入中获取数据，向aqiData中增加一条数据
     * 然后渲染aqi-list列表，增加新增的数据
     */
    function addAqiData() {
    	var r=/^\s+|\s+$/g;
    	var city = cityInput.value;
    	city=city.replace(r,"");
        var msg = validate.validCity(city);
        if (msg) {
            alert(msg);
            return;
        }
        var air = valueInput.value;
        air=air.replace(r,"");
        msg = validate.validAir(air);
        if (msg) {
            alert(msg);
            return;
        }
        aqiData[city]=air;
    }


    /**
     * 渲染aqi-table表格
     */
    function renderAqiList() {
    	var tbody=table.tBodies[0];
    	var hasData=false;
    	var str="<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
    	for(var key in aqiData){
    		 str+="<tr><td>"+key+"</td><td>"+aqiData[key]+"</td><td><button key="+key+">删除</button></td></tr>";
    		 hasData=true;
    	}
    	if(!hasData){
    		str="";
    	}
    	var temp=document.createElement('div');
    	temp.innerHTML="<table><tbody>"+str+"</tbody></table>";
    	table.replaceChild(temp.firstChild.firstChild,tbody);
    }


    /**
     * 点击add-btn时的处理逻辑
     * 获取用户输入，更新数据，并进行页面呈现的更新
     */
    function addBtnHandle() {
        addAqiData();
        renderAqiList();
    }

    /**
     * 点击各个删除按钮的时候的处理逻辑
     * 获取哪个城市数据被删，删除数据，更新表格显示
     */
    function delBtnHandle() {
        // do sth.
        var key=this.getAttribute("key");
        delete aqiData[key];
        renderAqiList();
    }

    function init() {

        addEvent(btn, "click",addBtnHandle);
        var tbody=document.createElement('tbody');
        table.appendChild(tbody);
        addEvent(table,"click","button",delBtnHandle)
    }

    init();



   

}
