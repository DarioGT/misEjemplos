/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/

// Ext.onReady(Ext.outils.init, Ext.outils);

Ext.require(["Ext.util.Cookies", "Ext.Ajax"]); 


Ext.outils = function(){
    var msgCt;

    function createBox(t, s){
       return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }
    return {
        msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            
            console.log ( title, ' ---> ', format  )
            
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: 1000, remove: true});
        },

    };
}();


var setCsRfToken = function (){
	// Add csrf token to every ajax request
	
	var token = Ext.util.Cookies.get('csrftoken');
	if(!token){
		Ext.Error.raise("Missing csrftoken cookie");
	} else {
		Ext.Ajax.defaultHeaders = Ext.apply(Ext.Ajax.defaultHeaders || {}, {
			'X-CSRFToken': token
		});
	}
};


//// ------------------------------------old school cookie functions
//var Cookies = {};
//Cookies.set = function(name, value){
//     var argv = arguments;
//     var argc = arguments.length;
//     var expires = (argc > 2) ? argv[2] : null;
//     var path = (argc > 3) ? argv[3] : '/';
//     var domain = (argc > 4) ? argv[4] : null;
//     var secure = (argc > 5) ? argv[5] : false;
//     document.cookie = name + "=" + escape (value) +
//       ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
//       ((path == null) ? "" : ("; path=" + path)) +
//       ((domain == null) ? "" : ("; domain=" + domain)) +
//       ((secure == true) ? "; secure" : "");
//};
//
//Cookies.get = function(name){
//	var arg = name + "=";
//	var alen = arg.length;
//	var clen = document.cookie.length;
//	var i = 0;
//	var j = 0;
//	while(i < clen){
//		j = i + alen;
//		if (document.cookie.substring(i, j) == arg)
//			return Cookies.getCookieVal(j);
//		i = document.cookie.indexOf(" ", i) + 1;
//		if(i == 0)
//			break;
//	}
//	return null;
//};
//
//Cookies.clear = function(name) {
//  if(Cookies.get(name)){
//    document.cookie = name + "=" +
//    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
//  }
//};
//
//Cookies.getCookieVal = function(offset){
//   var endstr = document.cookie.indexOf(";", offset);
//   if(endstr == -1){
//       endstr = document.cookie.length;
//   }
//   return unescape(document.cookie.substring(offset, endstr));
//};
