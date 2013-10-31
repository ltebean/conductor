(function() {

	var SCRIPT_NODE = $("#conductor");
	var attrs = {
		n: "{n}"
	};
	var funcs = {};

	function getDataAttrs(elem) {
        elem = $(elem);
        var node = elem.get(0);
        var attrs = {}, attr;
        var dataset = [];
        for (var i = 0, node_attrs = node.attributes, l = node_attrs.length; i < l; i++) {
            attr = node_attrs.item(i).nodeName;
            if (attr.indexOf("data-") == 0) {
                dataset.push(attr);
            }
        }
        dataset.forEach(function(k) {
            attrs[k.split("data-")[1]] = elem.attr(k);
        });
        return attrs;
    }

	$.extend(attrs, getDataAttrs(SCRIPT_NODE));

	function appendRule(rule) {
		var key = sub(rule.key, attrs);
		var action = rule.action;
		var cb = rule.cb;
		var delegate = rule.delegate;
		var parent = rule.parent;
		var selector = rule.selector;
		var els = $([parent, selector].join(" "));

		function logCurrent() {
			var n = els.toArray().indexOf(this) + 1;
			var func = funcs[cb];
			func.call(this, sub(key, {
				n : 1
			}), action, attrs);
		}


		if (action == "hover") {
			action = "mouseenter";
		}

		if (action == "show" && els.length) {
			els.forEach(function(el) {
				logCurrent.call(el)
			});
		} else {
			if (delegate) {
				$(parent).delegate(selector,action,logCurrent);
			} else {
				els.on(action, logCurrent);
			}
		}
	}

	$.ajax({
		async: true,
		url: "http://conductor.dianping.com/api/page/" + attrs["pagekey"],
		type: 'GET',
		dataType: 'jsonp',
		jsonp: 'callback',
		timeout: 5000,
		success: function(json) {
			//var config, callback;
			callback = JSON.parse(json.callback);
			for (var cb in callback) {
				funcs[cb] = new Function("key,action,attrs", callback[cb]);
			}

			config = JSON.parse(json.config);
			config.pv && dpga(sub(config.pv, attrs));
			config.rules.forEach(appendRule);
		}
	});

	function sub(template, params) {
		return ('' + template).replace(/\\?\{([^{}]+)\}/g, function(match, name) {
			return match.charAt(0) === '\\' ? match.slice(1) :
				(params[name] != null ? params[name] : '');
		});
	}
})();