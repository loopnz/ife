(function() {

    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
    var proxy=function( fn, context ) {
		return  function() {
			 fn.apply( context,arguments );
		};
	}
    function Component() {
        this.$el=$("body");
        this.$root = this;
        this.$$events = {};
        this.$$listeners = {};
        this.$$children = [];
    }

    Component.prototype = {
        constructor: Component,
        $initialize: function() {
            this.$delegateEvents();
        },
        $delegateEvents: function() {
            var key,match;
            for (key in this.$$events) {
               var  method = this.$$events[key];
                if (typeof method === "string") {
                    method = this[this.$$events[key]];
                }
                match = key.match(delegateEventSplitter);
                if (this.$detectEventSupport(match[1])) {
                    this.$el.on(match[1], match[2],proxy(method,this));
                } else {
                    this.$on(match[1],proxy(method,this));
                }
            }
        },
        $new: function() {
            var child;
            var ChildComponent = function() {};
            ChildComponent.prototype = this;
            child = new ChildComponent();
            child.$root = this.$root;
            child.$parent = this;
            child.$$events = {};
            child.$$listeners = {};
            child.$$children = [];
            this.$$children.push(child);
            return child;
        },
        $on: function(eventName, fn) {
            var listeners = this.$$listeners[eventName];
            if (!listeners) {
                this.$$listeners[eventName] = listeners = [];
            }
            listeners.push(fn);
            return function() {
                var index = listeners.indexOf(fn);
                if (index > -1) {
                    listeners[index] = null;
                }
            }
        },
        $emit: function(eventName) {
            var propagationStopped = false;
            var args = [].slice.call(arguments, 1);
            var event = {
                name: eventName,
                target: this,
                stopPropagation: function() {
                    propagationStopped = true;
                }
            };
            var listenerArgs = [event].concat(args);
            var self = this;
            do {
                event.currentTarget = self;
                self.$fireEvent(eventName, listenerArgs);
                self = self.$parent;
            } while (self && !propagationStopped);
            event.currentTarget = null;
            return event;
        },
        $broadcast: function(eventName) {
            var args = [].slice.call(arguments, 1);
            var event = {
                name: eventName,
                target: this
            };
            var listenerArgs = [event].concat(args);
            this.$every(eventName, listenerArgs);
            event.currentTarget = null;
            return event;
        },
        $every: function(eventName, listenerArgs) {
            listenerArgs[0].currentTarget = this;
            this.$fireEvent(eventName, listenerArgs);
            var i = 0;
            while (i < this.$$children.length) {
                if (this.$$children[i]===null) {
                	this.$$children[i].splice(i, 1);
                } else {
                	this.$$children[i].$every(eventName, listenerArgs);
                    i++;
                }
            }
        },
        $fireEvent: function(eventName, listenerArgs) {
            var listeners = this.$$listeners[eventName] || [];
            var i = 0;
            while (i < listeners.length) {
                if (listeners[i] === null) {
                    listeners.splice(i, 1);
                } else {
                    listeners[i].apply(null, listenerArgs);
                    i++;
                }
            }
            return event;
        },
        $detectEventSupport: function(eventName) {
            var tempElement = document.createElement('div'),
                isSupported;
            eventName = 'on' + eventName;
            isSupported = (eventName in tempElement);
            if (!isSupported) {
                tempElement.setAttribute(eventName, 'x');
                isSupported = typeof tempElement[eventName] === 'function';
            }
            tempElement = null;
            return isSupported;
        },
        $addChildComponent:function(component){
            component.$parent=this;
            component.$root=this.$root;
            this.$$children.push(component);
        },
        $destory:function(){
        	if(this.$parent){
        		var index=this.$parent.$$children.indexOf(this);
        		if(index>-1){
        			this.$parent.$$children[index]=null;
        		}
        	}
        	this.$$children=null;
        	this.$$listeners=null;
        	this.$$events=null;
        }
    }

    $.Component = Component;

    var componentId = 0;
    var baseComponent=new Component();

    $.createComponent = function(parent, props) {

        if (arguments.length === 1) {
            props = parent;
            parent = baseComponent.$new();
        }
        props.cid = componentId++;
        var component = $.extend(parent.$new(), props);
        component.$initialize();

        return component;
    }

})()
