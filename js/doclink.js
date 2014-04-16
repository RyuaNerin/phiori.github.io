var doclink = {
	_getTypeClass: function(t) {
		switch (t) {
			case 'module':
			case 'class':
			case 'constructor':
				return 'text-danger';
				break;
			case 'void':
			case 'object':
			case 'bool':
			case 'int':
			case 'float':
			case 'str':
			case 'list':
			case 'dict':
			case 'map':
				return 'text-info';
				break;
			case 'event':
				return 'text-warning';
			default:
				return 'text-success';
		}
	},
	makeSection: function(type, name, args, desc) {
		var i = j = k = 0;
		var result = [];
		var path = name.split('.');
		result[i++] = '<div class="docitem"><p class="big"><em class="';
		result[i++] = doclink._getTypeClass(type);
		result[i++] = '">';
		result[i++] = type;
		result[i++] = '</em> ';
		for (j = 0; j < path.length; j++) {
			if (j == path.length - 1) {
				result[i++] = '<kbd class="method">';
				result[i++] = path[j];
				result[i++] = '</kbd>';
			}
			else {
				result[i++] = '<span class="parent">';
				result[i++] = path[j];
				result[i++] = '</span>';
				result[i++] = '.';
			}
		}
		if (args instanceof Array) {
			result[i++] = '<big>(</big>';
			for (k = 0; k < args.length; k++) {
				result[i++] = '<em>';
				result[i++] = args[k];
				result[i++] = '</em>';
				result[i++] = ', ';
			}
			if (k != 0)
				result[i - 1] = '<big>)</big>';
			else
				result[i++] = '<big>)</big>';
		}
		else if (typeof args === 'string') {
			result[i++] = '<big>(</big><em class="';
			result[i++] = doclink._getTypeClass(args);
			result[i++] = '">';
			result[i++] = args;
			result[i++] = '</em><big>)</big>';
		}
		result[i++] = '</p><div class="method-desc"><p>';
		result[i++] = desc;
		result[i++] = '</p></div></div>';
		return result.join('');
	},
	makeArgItem: function(type, name, desc, disp) {
		var i = 0;
		var result = [];
		result[i++] = '<p class="big">';
		if (disp) {
			result[i++] = '<big>(</big><em class="';
			result[i++] = doclink._getTypeClass(disp);
			result[i++] = '">';
			result[i++] = disp;
			result[i++] = '</em><big>)</big> ';
		}
		result[i++] = '<em class="';
		result[i++] = doclink._getTypeClass(type);
		result[i++] = '">';
		result[i++] = type;
		result[i++] = '</em> <kbd class="method">';
		result[i++] = name;
		result[i++] = '</kbd>';
		result[i++] = '</p><div class="method-desc"><p>';
		result[i++] = desc;
		result[i++] = '</p></div>';
		return result.join('');
	},
	applySections: function() {
		$('div[type=doc]').each(function(i, e) {
			var type = $(e).children('[name=type]').text();
			var name = $(e).children('[name=name]').text();
			var args;
			var desc = $(e).children('[name=desc]').html() || '';
			var _args = $(e).children('ul[name=args]');
			if (_args.size() > 0) {
				args = [];
				_args.children().each(function(i, e) {
					args.push(e.textContent);
				});
			}
			else {
				_args = $(e).find('[name=args]');
				if (_args.size() > 0)
					args = _args.text();
			}
			e.outerHTML = doclink.makeSection(type, name, args, desc);
		});
		$('div[type=argdoc]').each(function(i, e) {
			var type = $(e).children('[name=type]').text();
			var name = $(e).children('[name=name]').text();
			var desc = $(e).children('[name=desc]').html() || '';
			var disp = $(e).children('[name=disp]').text();
			e.outerHTML = doclink.makeArgItem(type, name, desc, disp);
		});
	},
	applyLinks: function() {
		var types = $('.text-info');
		var classes = $('.text-success');
		var cores = $('.text-danger');
		var parents = $('.parent');
		var names = [];
		var ids = [];
		cores.each(function(i, e) {
			if (e.textContent === 'module') {
				var n = $(e).next();
				n.html('<a href="https://docs.python.org/3.4/library/' + n.text() + '.html" style="color:inherit">' + n.html() + '</a>');
			}
			names.push($(e).nextAll('kbd'));
		});
		classes.each(function(i, e) {
			names.push($(e).nextAll('kbd'));
		});
		types.each(function(i, e) {
			names.push($(e).nextAll('kbd'));
		});
		var setLink = function(i, e) {
			var c = $(e);
			if (ids.indexOf(c.text()) < 0)
				for (var i = 0; i < names.length; i++) {
					if (names[i].text() === c.text()) {
						names[i].html('<span id="' + c.text() + '" style="color:inherit">' + names[i].html() + '</a>');
						c.html('<a href="#' + c.text() + '" style="color:inherit">' + c.html() + '</a>');
						ids.push(c.text());
					}
				}
			else
				c.html('<a href="#' + c.text() + '" style="color:inherit">' + c.html() + '</a>');
		};
		parents.each(setLink);
		classes.each(setLink);
	}
}