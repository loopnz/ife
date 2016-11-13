

function TNode(options) {
    this.el = options.el;
    this.titleEl = this.el.querySelector('.title');
    this.titleBox = this.titleEl.parentNode;
    this.addBtn = this.el.querySelector(".add");
    this.delBtn = this.el.querySelector(".del");
    this.flag = this.el.querySelector(".nodeflag");
    this.title = options.title;
    this.expand = false;
    this.parent = options.parent;
    this.isLeaf = options.isLeaf || true;
    this.children = [];
    if (!this.parent) {
        this.level = 0;
    } else {
        this.level = this.parent.level + 1;
    }

    this.init();
}

TNode.prototype.init = function() {
    var self = this;
    if (this.isLeaf) {
        this.flag.classList.add("dn");
    }
    var span;
    var isAddSpan;
    if (this.title) {
        span = this.titleEl.querySelector('.title-span');
        isAddSpan = true;
    } else {
        span = document.createElement("span");
        isAddSpan = false;
    }

    var input = document.createElement("input");


    input.classList.add('nodeName');
    this.titleEl.appendChild(input);
    if (this.title) {
        input.classList.add('dn');
    } else {
        setTimeout(function() {
            input.focus();
        }, 0);
    }
    input.addEventListener("keyup", function(e) {
        var value = this.value;
        var code = e.which || e.keyCode;
        if (value && code == '13') {
            this.classList.add("dn");
            span.innerHTML = value;
            if (!isAddSpan) {
                self.titleEl.appendChild(span);
                isAddSpan = true;
            } else {
                span.classList.remove('dn');
            }
            self.title = value;
        }

    }, false);
    input.addEventListener("click", function(e) {
        e.stopPropagation();
    })
    span.addEventListener("dblclick", function(e) {
        this.classList.add('dn');
        input.classList.remove('dn');
        input.focus();
        e.stopPropagation();
    }, false);

    this.el.style.marginLeft = this.level * 10 + "px";
    this.addBtn.addEventListener('click', function(e) {
        self.doAdd();
        e.stopPropagation();
    }, false);
    this.delBtn.addEventListener('click', function(e) {
        self.doDel();
        e.stopPropagation();
    }, false);

    this.titleBox.addEventListener('click', function() {
        self.doFlag();
    }, false);
    this.titleBox.addEventListener("mouseover", function() {
        self.addBtn.style.display = "inline-block";
        self.delBtn.style.display = "inline-block";
    }, false);

    this.titleBox.addEventListener("mouseout", function() {
        self.addBtn.style.display = "none";
        self.delBtn.style.display = "none";
    }, false);
}
TNode.prototype.doFlag = function() {
    if (this.flag.classList.contains("tringle-left")) {
        this.flag.classList.remove("tringle-left");
        this.flag.classList.add("tringle-down");
        this.expandEl();
    } else {
        this.flag.classList.add("tringle-left");
        this.flag.classList.remove("tringle-down");
        this.shrink();
    }

}

TNode.prototype.changeLeaf = function(flag) {
    this.isLeaf = flag;
    if (this.isLeaf) {
        this.flag.classList.add("tringle-left");
        this.flag.classList.remove("tringle-down");
        this.flag.classList.add('dn');
    } else {
        this.flag.classList.remove("tringle-left");
        this.flag.classList.add("tringle-down");
        this.flag.classList.remove("dn");
    }
}

TNode.prototype.doAdd = function(title) {
    title = title || "";
    var node = page.createNode(title, this);
    this.children.push(node);
    this.changeLeaf(false);
    this.el.appendChild(node.el);
    return node;
}

TNode.prototype.doDel = function() {
    if (this.parent) {
        var index = this.parent.children.indexOf(this);
        this.parent.children.splice(index, 1);
        if (this.parent.children.length == 0) {
            this.parent.changeLeaf(true);
        }
    } else {
        page.tree = null;
    }
    var node = this.el.parentNode;
    node.removeChild(this.el);
    this.children = [];
}

TNode.prototype.expandEl = function() {
    this.expand = true;
    this.flag.classList.remove("tringle-left");
    this.flag.classList.add("tringle-down");
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].el.classList.remove('dn');
        }
    }
}

TNode.prototype.shrink = function() {
    this.expand = false;
    this.flag.classList.add("tringle-left");
    this.flag.classList.remove("tringle-down");
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].el.classList.add('dn');
        }
    }
}

var page = {
    tree: null,
    currentNode: null,
    init: function() {
   /*     this.btn = document.getElementById('btn');
        this.input = document.getElementById('input');*/
        this.searchBtn = document.getElementById('searchBtn');
        this.searchInput = document.getElementById('searchInput');
        this.initEvent();
    },
    initEvent: function() {
        var self = this;
/*        this.btn.addEventListener('click', function() {
            self.addRoot(self.input.value);
        }, false);*/
        this.searchBtn.addEventListener('click', function() {
            var value = self.searchInput.value;
            if (!value || !self.tree) {
                return;
            }
            self.doSearch(value);
        }, false);
    },
    doSearch: function(value) {
        if (this.currentNode) {
            for (var i = 0; i < this.currentNode.length; i++) {
                this.currentNode[i].titleEl.classList.remove("searched");
            }
        }
        this.currentNode = this.searchNode(this.tree, value);
        if (this.currentNode.length > 0) {
            for (var i = 0; i < this.currentNode.length; i++) {
                this.currentNode[i].titleEl.classList.add("searched");
                this.expand(this.currentNode[i]);
            }

        }
    },
    expand: function(node) {
        var parent = node.parent;
        while (parent) {
            if (!parent.expand) {
                parent.expandEl();
            }
            parent = parent.parent;
        }
    },
    searchNode: function(node, value) {
        var value = value.trim();
        var ret = [];
        if (node.title == value) {
            ret.push(node);
        }
        for (var i = 0; i < node.children.length; i++) {
            var arr = this.searchNode(node.children[i], value);
            ret = ret.concat(arr);
        }
        return ret;
    },
    addRoot: function(str) {
        this.tree = this.createNode(str);
        document.body.appendChild(this.tree.el);
    },
    createNode: function(str, parent) {
        var div = document.createElement('div');
        div.classList.add("mt10");
        div.classList.add('node');
        var title = document.createElement('div');
        title.innerHTML = "<span class='nodeflag tringle-left '></span>" +
            "<span class='ml10 mr10 title'><span class='title-span'>" + str + "</span></span>" +
            "<button class='add'>+</button><button class='del'>-</button>";
        div.appendChild(title);
        var node = new TNode({
            el: div,
            parent: parent,
            title: str,
            isLeaf: true
        })
        return node;
    }

}

var obj = {
    "name": "root",
    children: [{
        name: "book",
        children: [{
            name: "js",
            children: [{
                name: "js高级程序设计"
            }]
        }, {
            name: "java",
            children: []
        }]
    }, {
        name: "cook",
        children: [{
            name: "pot"
        }, {
            name: "pen"
        }]
    }]
}


function createTree(obj, node) {
    if (!node) {
        node = page.createNode(obj.name);
    }
    obj.children = obj.children || [];
    for (var i = 0; i < obj.children.length; i++) {
        var childNode = node.doAdd(obj.children[i].name);
        createTree(obj.children[i], childNode);
    }
    return node;
}

var node = createTree(obj);
document.body.appendChild(node.el);
page.init();
page.tree = node;