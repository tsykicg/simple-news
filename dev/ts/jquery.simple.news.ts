/// <reference path="typings/jquery/jquery.d.ts" />

class SimpleNews {
	node: string;
	path: string;
	num: any;
	$target: any;
	$window: any;

	constructor(obj: { path: string; num: number; target: string; }) {
		this.node = "";
		this.path = obj.path;
		this.num  = obj.num;
		this.$target = $(obj.target);
		this.$window = $(window);
		this.handleEvents();
	}

	private handleEvents(): void {
		this.$window.on('load', () => {
			this.getData().done((data) => {
				this.createNode(data);
				this.render();
			});
		});
	}

	public getData() {
		var defer = $.Deferred();
		$.ajax({
			url: this.path,
			dataType: 'json',
			success: defer.resolve,
			error: defer.reject
		});
		return defer.promise();
	}

	public createNode(data): string {
		var host = location.host;

		this.node  = '<dl>';
		$.each(data, (key) => {
			var url:string    = data[key].url;
			var target:string = this.getTargetBlank(host, url);

			this.node += '<dt>' + data[key].date + '</dt>';
			this.node += url !== "" ? '<dd><a href="' + url + '"' + target + '>' + data[key].text + '</a></dd>' : '<dd>' + data[key].text + '</dd>';
			if( key === (parseInt(this.num) - 1) ) {
				return false;
			}
		});
		this.node += '</dl>';

		return this.node;
	}

	public getTargetBlank(host: string, url: string): string {
		return host === this.getHost(url) ? '' : 'target="_blank"';
	}

	public getHost(href: string): string {
		return href.replace(/http:\/\/|https:\/\//g, '').split("/")[0];
	}

	public render(): void {
		if(this.node === "") {
			console.log("データが取得できていません。");
		} else {
			this.$target.html(this.node);
		}
	}
}
