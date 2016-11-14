/*
如图（打开查看），创建一个虚拟宇宙，包括一个行星和飞船
每个飞船由以下部分组成
动力系统，可以完成飞行和停止飞行两个行为，暂定所有飞船的动力系统飞行速度是一致的，
比如每秒20px，飞行过程中会按照一定速率消耗能源（比如每秒减5%）
能源系统，提供能源，并且在宇宙中通过太阳能充电（比如每秒增加2%，具体速率自定）
信号接收处理系统，用于接收行星上的信号
自爆系统，用于自我销毁
每个飞船的能源是有限的，用一个属性来表示能源剩余量，这是一个百分比，表示还剩余多少能源。
能源耗尽时，飞船会自动停止飞行
飞船有两个状态：飞行中和停止，飞船的行为会改变这个属性状态
飞船的自我销毁方法会立即销毁飞船自身
行星上有一个指挥官（不需要在页面上表现出其形象），指挥官可以通过行星上的信号发射器发布如下命令
创建一个新的飞船进入轨道，最多可以创建4个飞船，刚被创建的飞船会停留在某一个轨道上静止不动
命令某个飞船开始飞行，飞行后飞船会围绕行星做环绕运动，需要模拟出这个动画效果
命令某个飞船停止飞行
命令某个飞船销毁，销毁后飞船消失、飞船标示可以用于下次新创建的飞船
你需要设计类似如下指令格式的数据格式
			{
				id: 1,
				commond: 'stop'
			}
		
指挥官通过信号发射器发出的命令是通过一种叫做Mediator的介质进行广播
Mediator是单向传播的，只能从行星发射到宇宙中，
在发射过程中，有30%的信息传送失败（丢包）概率，你需要模拟这个丢包率，
另外每次信息正常传送的时间需要1秒
指挥官并不知道自己的指令是不是真的传给了飞船，
飞船的状态他是不知道的，他只能通过自己之前的操作来假设飞船当前的状态
每个飞船通过信号接收器，
接受到通过Mediator传达过来的指挥官的广播信号，
但因为是广播信号，
所以每个飞船能接受到指挥官发出给所有飞船的所有指令，
因此需要通过读取信息判断这个指令是不是发给自己的
*/


var Util = {
    each: function(arr, fn) {
        for (var i = 0; i < arr.length; i++) {
            var ret = fn(arr[i], i);
            if (ret === false) {
                break;
            }
        }
    },
    extend: function(src, source) {
        var key;
        for (key in source) {
            src[key] = source[key];
        }
    },
    inherit: function(base, props) {
        if (typeof base !== "function") {
            props = base;
            base = this.observer;
        }
        var child = function() {
            base.apply(this, arguments);
            if(this.init){
            	this.init.apply(this,arguments);
            }
        };
        var temp = function() {};
        temp.prototype = base.prototype;
        child.prototype = new temp();
        child.prototype.constructor = child;
        this.extend(child.prototype, props);
        return child;
    },
    observer: function() {
        this.listeners = {};
    }
}

Util.observer.prototype = {
    constructor: Util.observer,
    $on: function(event, fn, context) {
        fn.context = context || this;
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
    },
    $off: function(event, fn) {
        if (!this.listeners[event]) {
            return false;
        }
        if (!fn) {
            delete this.listeners[event];
        } else {
            var idx = null;
            Util.each(this.listeners[event], function(elem, i) {
                if (elem === fn) {
                    idx = i;
                    return false;
                }
            })
            if (idx) {
                this.listeners[event] = this.listeners[event].splice(idx, 1);
            }
        }
        return true;
    },
    $emit: function(event) {
        var arg = Array.prototype.slice.apply(arguments);
        arg = arg.slice(1);
        Util.each(this.listeners[event], function(elem, i) {
            return elem.apply(elem.context, arg);
        })
    }
}


var createSpacecraftFactory = {
    sidPoor: [],
    sid: 0,
    $new: function(options) {
        options = options || {};
        var mediator = options.mediator || new Mediator();
        var engine = options.engine || new Engine();
        var energy = options.energy || new Energy();
        var spacecraft = new Spacecraft(options);
        if (this.sidPoor.length > 0) {
            spacecraft.id = this.sidPoor.shift()[0];
        } else {
            spacecraft.id = this.sid++;
        }
        mediator.register(spacecraft);
        spacecraft.mediator = mediator;
        spacecraft.engine = engine;
        spacecraft.energy = energy;
        spacecraft.engine.energy = energy;
        energy && energy.init();
        energy && engine && engine.init();
        return spacecraft;
    }

}


function Spacecraft(options) {
    this.options = options || {};
    this.status = "stop";
}

Spacecraft.prototype = {

    send: function(command) {
        this.mediator.notify(command, this);
    },
    run: function() {

    },
    stop: function() {

    },
    destory: function() {
        var index = this.medistor.$$watcher.indexOf(this);
        this.medistor.$$watcher.splice(index, 1);

    }

}

var Engine = Util.inherit({
    init: function() {

    }
})

var Energy = Util.inherit({
    init: function(units) {
    	var self=this;
    	this.energyNum=100;
    	this.units=units;
    	for(var i=0;i<units.length;i++){
    		units[i].$on("consume",function(num){
    			self.doConsume(num);
    		})
    	}
    },
    doConsume:function(num){
    	
    }
})

function Mediator() {
    this.$$watcher = [];
}

Mediator.prototype = {
    constructor: Mediator,
    register: function(spacecraft) {
        this.$$watcher.push(spacecraft);
    },
    unregister: function(spacecraft) {
        var index = this.$$watcher.indexOf(spacecraft);
        this.$$watcher.splice(index, 1);
    },
    notify: function(command, from) {
        if (command.id) {
            Util.each(this.$$watcher, function(obj, i) {
                if (command.id === obj.id) {
                    obj[command.command](from, command);
                }
            })
        } else {
            Util.each(this.$$watcher, function(obj, i) {
                if (obj.id !== from.id) {
                    obj[command.commond](from, command);
                }
            })
        }
    }
}

var commander = createSpacecraftFactory.$new();



// 16-11-14 09:53:12,643 [INFO ] com.sts.obt.util.TLinkUtils {TLinkUtils.java:75} - TLink请求参数transactionName[TR_ApproveActionRQ]request[{
// 	"Header":{
// 		"Application":"sts_basic"
// 	},
// 	"Identity":{
// 		"EmplyID":1266,
// 		"PassWord":"1164f9e5b8cef768396dcd5374e4b6eb",
// 		"TMCServiceCode":{
// 			"AirOfficeID":"BJS131",
// 			"IsDefault":"\u0000",
// 			"ServiceID":"beifen",
// 			"THUBOfficeID":"BJS723",
// 			"TMCID":"1040",
// 			"ThubChannelCode":"BJS723BJS723LEN",
// 			"ThubUserName":"BJS72300C",
// 			"ThubUserPasswd":"6fa172152046878e0c3188d08ee35adb"
// 		}
// 	},
// 	"Source":{
// 		"BookingChannel":"WEB"
// 	},
// 	"TransactionName":"TR_ApproveActionRQ",
// 	"approveActionInfo":{
// 		"Action":"C",
// 		"FormEmplyID":"1266",
// 		"FormEmplyName":"李薇",
// 		"FormNO":"91000937122",
// 		"FormType":"I"
// 	},
// 	"nextApprovers":[
// 		{
// 			"ApproverID":"1266",
// 			"Level":"1"
// 		},
// 		{
// 			"ApproverID":"1013",
// 			"Level":"2"
// 		}
// 	]
// }]
