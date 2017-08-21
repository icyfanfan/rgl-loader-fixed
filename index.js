var loaderUtils = require("loader-utils");
var minify = require('html-minifier').minify;

      
module.exports = function(content) {
    this.cacheable && this.cacheable();

    var query = loaderUtils.parseQuery(this.query) || {};
    var tpl = content || '';

    tpl = cleanRedundantCode(tpl, query);// remove redundant code
    
    return "module.exports = " + JSON.stringify(tpl);
};

// pure regEx to resolve it, not via a parser;
function cleanRedundantCode(str, opts){
    opts = opts || {};
    var minimize = true;
    var comments = opts.comments || {};
    var htmlComments = comments.html,
        rglComments = comments.rgl;

    if(minimize && typeof str === 'string'){
        var SINGLE_SPACE = ' ';
        var EMPTY = '';

        // remove html-comments <!-- xxx -->
        // str = !htmlComments ? str.replace(/<!-[\s\S]*?-->/g, EMPTY) : str;
        str = str.replace(/<!-[\s\S]*?-->/g, EMPTY);

        // remove regular-comments {! xxx !}
        // str = !rglComments ? str.replace(/{![\s\S]*?!}/g, EMPTY) : str;
        str = str.replace(/{![\s\S]*?!}/g, EMPTY);

        // 去除html标签之间的空格和换行
        str = str.replace(/.>[\s]+<./g, function(i){
            return i.replace(/[\s]/g,'');
        });
        
        // 去掉html标签和rgl标签之间的空格和换行
        str = str.replace(/.>[\s]+{[#|/]/g, function(i){
            return i.replace(/[\s]/g,'');
        });
        // 去掉rgl标签和html标签之间的空格和换行
        str = str.replace(/.}[\s]+<./g, function(i){
            return i.replace(/[\s]/g,'');
        });

        str = str.trim();
    }
    return str;
};
