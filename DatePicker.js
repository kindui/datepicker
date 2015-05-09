/**
 * Author: humanhuang
 * Date: 2013-8-30
 */
function DatePicker(options) {

    this.domId = options.domId;
    this.initValue = options.initValue || "请选择日期";
    this.inputbox = null;
    var self = this;
    this.calendar = new Calendar({
        onclick: function () {
            self.setValue(self.calendar.getDate());
        }
    });
    this.buildHTML();
    this.initEvent();
}

DatePicker.prototype = {
    buildHTML: function () {
        var doc = document;

        this.inputbox= doc.createElement("input");
        this.inputbox.type = "text";
        this.inputbox.value =  this.initValue;

        var dom = doc.getElementById(this.domId);
        dom.parentNode.insertBefore(this.inputbox, dom);
        dom.parentNode.removeChild(dom);

    },
    setValue: function (value) {
        this.inputbox.value =value;
    },
    getValue: function () {
        return this.inputbox.value;
    },
    initEvent: function () {
        var self = this;
        Y(self.inputbox).on("click", function (e) {

            var target = e.target,
                offset = Y(self.inputbox).offset();

            self.show();
            self.calendar.outerDiv.style.top = offset.top + 23 + "px";
            self.calendar.outerDiv.style.left = offset.left + 1 + "px";
            e.stopPropagation();
        });

    },
    show: function () {
        this.calendar.outerDiv.style.display = "";
    },
    hide: function () {
        this.calendar.outerDiv.style.display = "none";
    }
}