if ("undefined" == typeof jQuery) throw new Error("This application requires jQuery");

jQuery.namespace = function () {
    var a = arguments, o = null, i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = a[i].split(".");
        o = window;
        for (j = 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
};
jQuery.fn.exists = function () { return this.length > 0; }
jQuery.extend({    
    stringify: function stringify(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);

            for (n in obj) {
                v = obj[n];
                t = typeof (v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = jQuery.stringify(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    },
    stringifyAsText: function stringifyAsText(obj) {

        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = "'" + obj + "'";
            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);

            for (n in obj) {
                v = obj[n];
                t = typeof (v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string")
                        v = "'" + v.replace(/'/g, "\\\\'") + "'";
                    else if (t == "object" && v !== null)
                        v = jQuery.stringifyAsText(v);

                    json.push((arr ? '' : "'" + n + "':") + String(v));
                }
            }
            return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}');
        }


    }
});

jQuery.namespace('adg', 'adg.ui', 'adg.constant', 'adg.data', 'adg.util');


//General Functions
adg.util = {
    init: function () {
        this.initHeight();
    },
    initHeight: function () {
        $('body').css('min-height', $(window).height() - 90);
        $('.demo').css('min-height', $(window).height() - 160);
    }
};

$(document).ready(function () {
    adg.util.init();
    adg.pageInit();
})


$(window).resize(function () {
    adg.util.initHeight();
});

