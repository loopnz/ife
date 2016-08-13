window.onload = function() {

    /* 数据格式演示
    var aqiSourceData = {
      "北京": {
        "2016-01-01": 10,
        "2016-01-02": 10,
        "2016-01-03": 10,
        "2016-01-04": 10
      }
    };
    */

    // 以下两个函数用于随机模拟生成测试数据
    function getDateStr(dat) {
        var y = dat.getFullYear();
        var m = dat.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dat.getDate();
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
    }

    function randomBuildData(seed) {
        var returnData = {};
        var dat = new Date("2016-01-01");
        var datStr = ''
        for (var i = 1; i < 92; i++) {
            datStr = getDateStr(dat);
            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }
        return returnData;
    }

    var aqiSourceData = {
        "北京": randomBuildData(500),
        "上海": randomBuildData(300),
        "广州": randomBuildData(200),
        "深圳": randomBuildData(100),
        "成都": randomBuildData(300),
        "西安": randomBuildData(500),
        "福州": randomBuildData(100),
        "厦门": randomBuildData(100),
        "沈阳": randomBuildData(500)
    };

    // 用于渲染图表的数据
    var chartData = {};

    // 记录当前页面的表单选项
    var pageState = {
        nowSelectCity: -1,
        nowGraTime: "day"
    }

    /**
     * 渲染图表
     */
    function renderChart() {
        var wrap = document.getElementById("wrap");
        var doc = document.createDocumentFragment();
        var data = chartData[pageState.nowGraTime][pageState.nowSelectCity];
        var i = 1;
        for (var key in data) {
            var div = document.createElement('div');
            setDivStyle(div, i, key, data[key]);
            i++;
            doc.appendChild(div);
        }
        wrap.innerHTML = "";
        wrap.appendChild(doc);
    }

    function setDivStyle(div, idx, key, value) {
        div.className = pageState.nowGraTime;
        var width;
        if (pageState.nowGraTime == "day") {
            width = 11;
            div.title = key + " " + pageState.nowSelectCity + " 空气质量指数：" + value;
        } else if (pageState.nowGraTime == "week") {
            width = 31;
            div.title = "第" + (Number(key) + 1) + "周 " + pageState.nowSelectCity + " 空气质量指数：" + value;
        } else {
            width = 51;
            div.title = key + pageState.nowSelectCity + " 空气质量指数：" + value;
        }

        div.style.height = value + "px";
        div.style.left = idx * width + "px";
        if (value < 50) {
            div.style.backgroundColor = "green";
        } else if (value >= 50 && value < 100) {
            div.style.backgroundColor = "blue";
        } else if (value >= 100 && value < 200) {
            div.style.backgroundColor = "yellow";
        } else if (value >= 200 && value < 300) {
            div.style.backgroundColor = "red";
        } else {
            div.style.backgroundColor = "black";
        }
    }

    /**
     * 日、周、月的radio事件点击时的处理函数
     */
    function graTimeChange(e) {
        // 确定是否选项发生了变化 
        if (e.target.nodeName == 'INPUT' && e.target.getAttribute('name') == "gra-time") {
            if (e.target.checked && e.target.value !== pageState.nowGraTime) {
                pageState.nowGraTime = e.target.value;
                renderChart();
            }
        }

        // 设置对应数据

        // 调用图表渲染函数
    }

    /**
     * select发生变化时的处理函数
     */
    function citySelectChange() {
        // 确定是否选项发生了变化 
        var city = this.value;
        if (city !== pageState.nowSelectCity) {
            pageState.nowSelectCity = city;
            renderChart();
        }

        // 设置对应数据

        // 调用图表渲染函数
    }

    /**
     * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
     */
    function initGraTimeForm() {
        var form = document.getElementById("form-gra-time");

        form.addEventListener("click", graTimeChange, false)
    }

    /**
     * 初始化城市Select下拉选择框中的选项
     */
    function initCitySelector() {
        // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

        // 给select设置事件，当选项发生变化时调用函数citySelectChange
        var key, select = document.getElementById("city-select"),
            doc = document.createDocumentFragment();
        for (key in aqiSourceData) {
            var option = document.createElement('option');
            option.innerHTML = key;
            doc.appendChild(option);
        }
        select.appendChild(doc);
        select.value = select.children[0].value;
        pageState.nowSelectCity = select.value;
        select.addEventListener('change', citySelectChange);
    }

    /**
     * 初始化图表需要的数据格式
     */
    function initAqiChartData() {
        // 将原始的源数据处理成图表需要的数据格式
        // 处理好的数据存到 chartData 中
        var nowGraTime = pageState.nowGraTime;

        for (var key in aqiSourceData) {
            initDayData(key, aqiSourceData[key]);
            initWeekData(key, aqiSourceData[key]);
            initMonthData(key, aqiSourceData[key]);
        }
        console.log(chartData);
    }

    function initDayData(key, value) {
        chartData["day"] = chartData["day"] || {};
        chartData["day"][key] = chartData["day"][key] || {};
        chartData["day"][key] = value;
    }

    function initWeekData(key, value) {
        chartData["week"] = chartData["week"] || {};
        chartData["week"][key] = chartData["week"][key] || {};
        var keys = Object.keys(value);
        var date = new Date(keys[0].split("-").join("/"));
        var start = 7 - date.getDay();

        var firstWeek = keys.slice(0, start);
        var num = Math.ceil((keys.length - firstWeek.length) / 7);
        var temp = [];
        temp.push(firstWeek)
        for (var i = 0; i < num; i++) {
            var arr = keys.slice(start, start + 7);
            start = start + 7;
            temp.push(arr);
        }
        var obj = {};
        for (var i = 0; i < temp.length; i++) {
            var week = temp[i];
            var sum = 0;
            for (var j = 0; j < week.length; j++) {
                sum += value[week[j]];
            }
            var average = parseInt(sum / week.length);
            obj[i] = average;
        }
        chartData["week"][key] = obj;

    }


    function initMonthData(key, value) {
        chartData["month"] = chartData["month"] || {};
        chartData["month"][key] = chartData["month"][key] || {};

        var obj = {};
        for (var date in value) {
            obj[date.slice(0, 7)] = obj[date.slice(0, 7)] || [];
            obj[date.slice(0, 7)].push(value[date]);
        }

        for (var date in obj) {
            var sum = 0;
            var arr = obj[date];
            for (var i = 0; i < arr.length; i++) {
                sum += arr[i];
            }
            obj[date] = Math.floor(sum / arr.length);
        }

        chartData["month"][key] = obj;
    }


    /**
     * 初始化函数
     */
    function init() {
        initGraTimeForm()
        initCitySelector();
        initAqiChartData();
    }

    init();

    renderChart();


}
