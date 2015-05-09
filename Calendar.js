/**
 * onclick:function(){}
 * User: humanhuang
 * Date: 2013-8-9
 */
function Calendar(options) {
    this.date = new Date();
    this.today = this.initToday();
    this.options = Y.mix(this.getOptions(), options);
    this.genID = Math.random().toString(16).substring(2);
    this.outerDiv = document.createElement("div");

    this.table = null;
    this.tableHeader = null;
    this.tableBody = null;
    this.tableFooter = null;


    this.buildHTML();
    this.buildCSS();
    this.renderToId();
    this.initEvent();
}
Calendar.prototype = {
    getOptions: function () {
        return {
            domId: null,
            weeks: ["日", "一", "二", "三", "四", "五", "六"]
        }
    },
    initToday: function () {
        return new Date();
    },
    getDate: function () {
        var date = this.date,
            month = date.getMonth() + 1,
            day = date.getDate();
        if ((month + "").length == 1) {
            month = "0" + month;
        }
        if ((day + "").length == 1) {
            day = "0" + day;
        }
        return date.getUTCFullYear() + "-" + month + "-" + day;
    },
    buildHTML: function () {
        this.buildTable();
        this.buildTableHeader();
        this.buildTableBody();
        this.buildTableFooter();
    },
    buildTable: function () {
        this.table = document.createElement("table");
        this.table.id = this.genID;
        this.tableHeader = document.createElement("thead");
        this.tableBody = document.createElement("tbody");
        this.tableFooter = document.createElement("tfoot");
    },
    reRender: function () {
        this.outerDiv.removeChild(this.table);
        this.buildHTML();
        this.buildCSS();
        this.outerDiv.appendChild(this.table);
    },
    initEvent: function () {
        var self = this;
        Y(this.outerDiv).on("click", function (e) {
               var  target = e.target;

            if (target.className === "ymcalender-next-month") {
                self.date.setMonth(self.date.getMonth() + 1);
                self.reRender();
            } else if (target.className === "ymcalender-prev-month") {
                self.date.setMonth(self.date.getMonth() - 1);
                self.reRender();
            }
            else if (target.className === "ymcalender-next-year") {
                self.date.setUTCFullYear(self.date.getUTCFullYear() + 1);
                self.reRender();
            }
            else if (target.className === "ymcalender-prev-year") {
                self.date.setUTCFullYear(self.date.getUTCFullYear() - 1);
                self.reRender();
            } else if (target.nodeName.toLowerCase() == "td") {
                var day = target.innerHTML;
                if (day) {
                    self.date.setDate(day);
                    self.options.onclick&& self.options.onclick(event);
                }
                self.hide();
            }
            e.stopPropagation();
        });
        Y(this.outerDiv).on("mouseover", function (e) {
            var target = e.target;

            if (target.nodeName.toLowerCase() === "td") {
                target.className = "td-hover";
            }
        });
        Y(this.outerDiv).on("mouseout", function (e) {
            var target = e.target;

            if (target.nodeName.toLowerCase() === "td") {
                target.className = "";
            }
        });

        Y(document).on("click", function (e) {
            self.hide();
        });
    },
    show: function () {
        this.outerDiv.style.display = "inline-block";
    },
    hide: function () {
        this.outerDiv.style.display = "none";
    },
    buildCSS: function () {
        this.tableHeader.cellPadding = "0px";
        this.tableHeader.cellSpacing = "0px";

        Y(this.outerDiv).css({
            position: "absolute",
            width: "163px",
            display: "inline-block",
            background: "white",
            "z-index": 999
        });
//        YM.dom.css(this.outerDiv, {
//            position: "absolute",
//            width: "163px",
//            display: "inline-block",
//            background: "white",
//            "z-index": 999
//        });
        this.outerDiv.className = "ymCalendar";
    },
    buildTableHeader: function () {
        var dateString = this.date.getUTCFullYear() + "年" + (this.date.getMonth() + 1) + "月";
        var tableHeader = this.tableHeader;

        var doc = document,
            tableHeader = this.tableHeader, tr, th, a;

        function createATag(title, classname, content) {
            var a = doc.createElement("a");
            a.href = "javascript:;";
            a.className = classname ? classname : "";
            a.appendChild(doc.createTextNode(content));
            a.title = title ? title : "";
            return a;
        }

        function createTHTag(content) {
            var th = doc.createElement("th");
            if (content) {
                th.appendChild(doc.createTextNode(content));
            }
            return th;
        }

        function createTrTag(classname) {
            var tr = doc.createElement("tr");
            tr.className = classname ? classname : "";
            return tr;
        }

        tr = createTrTag("ymCalendar-title");

        a = createATag("上一年", "ymcalender-prev-year", "<<");
        th = createTHTag();
        th.appendChild(a);
        tr.appendChild(th);

        a = createATag("上一月", "ymcalender-prev-month", "<");
        th = createTHTag();
        th.appendChild(a);
        tr.appendChild(th);

//        var span = doc.createElement("span");
//        span.innerHTML = dateString;

        th = createTHTag(dateString);
        //兼容ie7 setAttribute
        th.setAttribute("colspan", 3);
//        th.colspan = 3;
        tr.appendChild(th);

        a = createATag("下一月", "ymcalender-next-month", ">");
        th = createTHTag();
        th.appendChild(a);
        tr.appendChild(th);

        a = createATag("下一年", "ymcalender-next-year", ">>");
        th = createTHTag();
        th.appendChild(a);
        tr.appendChild(th);

        tableHeader.appendChild(tr);

        tr = createTrTag("ymCalendar-week");

        var weeks = this.options.weeks;
        for (var i = 0; i < 7; i++) {
            tr.appendChild(createTHTag(weeks[i]));
        }

        tableHeader.appendChild(tr);

//        this.tableHeader.innerHTML =
//            [
//                '<thead>',
//                '<tr class="ymCalendar-title">',
//                '<th><a href="javascript:;" title="上一年" class="ymcalender-prev-year">&lt;&lt;</a></th>',
//                '<th><a href="javascript:;" title="上一月" class="ymcalender-prev-month">&lt;</a></th>',
//                '<th colspan="3">' + dateString + '</th>',
//                '<th><a href="javascript:;" title="下一月" class="ymcalender-next-month">&gt;</a></th>',
//                '<th><a href="javascript:;" title="下一年" class="ymcalender-next-year">&gt;&gt;</a></th>',
//                '</tr>',
//                '<tr class="ymCalendar-week"><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>',
//                '</thead>'
//
//            ].join("");
    },
    buildTableFooter: function () {
        this.table.appendChild(this.tableHeader);
        this.table.appendChild(this.tableBody);
        this.outerDiv.appendChild(this.table);
    },
    buildTableBody: function () {

        var date = Y.clone(this.date);
        //填充一个月前面的空格天数
        var leaveSpace = ( date.setDate(1), date.getDay());
        //一个月的最后一天
        var endDay = (date.setMonth(date.getMonth() + 1), date.setDate(0), date.getDate());

        var tr, td, trLength;

        var tableBody = this.tableBody,
            doc = document;

        tr = doc.createElement("tr");
        for (var i = 0; i < leaveSpace; i++) {
            tr.appendChild(doc.createElement("td"));
        }
        for (var i = 1; i <= endDay; i++) {
            trLength = tr.children.length;
            if (trLength === 7) {
                //换行
                tableBody.appendChild(tr);
                tr = doc.createElement("tr");
                i--;
            } else if (i === endDay) {
                //最后一天
                tableBody.appendChild(tr);
            } else {
                td = doc.createElement("td");
                td.appendChild(doc.createTextNode(i));
                tr.appendChild(td);
                if (trLength === 0 || trLength === 6) {
                    td.className = "ymCalendar-weekend";
                }

                //如果是今天则加边框
                if (this.today.getMonth() === date.getMonth() && this.today.getDate() == i) {
                    td.className = "cur";
//                    YM.dom.addClass(td, "cur");
                }
            }
        }
    },
    renderToId: function () {
        document.body.appendChild(this.outerDiv);
        this.hide();
    }
}