/// <reference path="typings/jquery/jquery.d.ts" />
var SimpleNews = (function () {
    function SimpleNews(obj) {
        this.node = "";
        this.path = obj.path;
        this.num = obj.num;
        this.$target = $(obj.target);
        this.$window = $(window);
        this.handleEvents();
    }
    SimpleNews.prototype.handleEvents = function () {
        var _this = this;
        this.$window.on('load', function () {
            _this.getData().done(function (data) {
                _this.createNode(data);
                _this.render();
            });
        });
    };
    SimpleNews.prototype.getData = function () {
        var defer = $.Deferred();
        $.ajax({
            url: this.path,
            dataType: 'json',
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    };
    SimpleNews.prototype.createNode = function (data) {
        var _this = this;
        var host = location.host;
        this.node = '<dl>';
        $.each(data, function (key) {
            var url = data[key].url;
            var target = _this.getTargetBlank(host, url);
            _this.node += '<dt>' + data[key].date + '</dt>';
            _this.node += url !== "" ? '<dd><a href="' + url + '"' + target + '>' + data[key].text + '</a></dd>' : '<dd>' + data[key].text + '</dd>';
            if (key === (parseInt(_this.num) - 1)) {
                return false;
            }
        });
        this.node += '</dl>';
        return this.node;
    };
    SimpleNews.prototype.getTargetBlank = function (host, url) {
        return host === this.getHost(url) ? '' : 'target="_blank"';
    };
    SimpleNews.prototype.getHost = function (href) {
        return href.replace(/http:\/\/|https:\/\//g, '').split("/")[0];
    };
    SimpleNews.prototype.render = function () {
        if (this.node === "") {
            console.log("データが取得できていません。");
        }
        else {
            this.$target.html(this.node);
        }
    };
    return SimpleNews;
})();
