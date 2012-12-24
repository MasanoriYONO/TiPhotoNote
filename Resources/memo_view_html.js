var win = Ti.UI.currentWindow;
var str_memo = win.memo;
var str_text_color = win.text_color;
var str_back_color = win.back_color;
var label_x = win.label_x;
var label_y = win.label_y;
//photo_idはテーブル内で重複する。複数のメモを認めるので。
var photo_id = win.image_id;
var a_memo_ct = win.a_memo_ct;

var idx = win.idx;
if((idx != 'undefined') && (idx != null)){
	Titanium.App.Properties.setInt("label_index",idx);
	Titanium.API.debug("label_index: " + typeof(idx) + ': '+ idx
				+ " photo_id:" + photo_id + " a_memo_ct:" + a_memo_ct);
}


Titanium.API.debug("label_index:"  + idx + " label_x:"  + label_x + " label_y:"  + label_y
					+ " photo_id:" + photo_id + " a_memo_ct:" + a_memo_ct);

webView = Ti.UI.createWebView();
webView.url = "mv.html";
//webView.scalesPageToFit = true;
win.add(webView);

function jstrlen(str,len,i) {
   len = 0;
   str = escape(str);
   for (i = 0; i < str.length; i++, len++) {
      if (str.charAt(i) == "%") {
         if (str.charAt(++i) == "u") {
            i += 3;
            len++;
         }
         i++;
      }
   }
   return len;
}

webView.addEventListener('load', function(e){
/*
	if(str_memo != null){
		webView.evalJS("document.getElementById('memo_text').value = '"  + str_memo + "'");
		webView.evalJS("document.getElementById('sample_view').innerHTML = '"  + str_memo + "'");
		var str_length = jstrlen(str_memo);
		var s_width = str_length * 10;
		webView.evalJS("document.getElementById('sample_view').style.width=" +  s_width + "'px'");
		//webView.evalJS("document.getElementById('sample_view').style.textAlign='center'");
		
	}else{
		//webView.evalJS("document.getElementById('memo_text').value = 'ラベルの文字を入力'");
	}
	
	if(str_text_color != null){
		var item_count = webView.evalJS("document.getElementById('label_text_color').options.length");
		for(var i=0;i<item_count;i++){
			if(str_text_color == webView.evalJS("document.getElementById('label_text_color').options[" + i + "].value")){
				webView.evalJS("document.getElementById('label_text_color').selectedIndex = " + i);
				webView.evalJS("document.getElementById('sample_view').style.color ="+str_text_color);
				Titanium.API.debug("str_text_color: "  + i);
				break;
			}
		}
	}
	
	if(str_back_color != null){
		var item_count = webView.evalJS("document.getElementById('label_back_color').options.length");
		for(var i=0;i<item_count;i++){
			if(str_back_color == webView.evalJS("document.getElementById('label_back_color').options[" + i + "].value")){
				webView.evalJS("document.getElementById('label_back_color').selectedIndex = " + i);
				webView.evalJS("document.getElementById('sample_view').style.backgroundColor ="+str_back_color);
				Titanium.API.debug("str_back_color: "  + i);
				break;
			}
		}
	}
	//webView.repaint();
	//webView.evalJS("document.getElementById('memo_text').focus()");
*/
});

function zero_pad(v){
	var rel = "00" + v;
	return rel.slice(-2);
}

Ti.App.addEventListener("selectDropdownList", function(e){
	var label_text_color = webView.evalJS("document.getElementById('label_text_color').options[document.getElementById('label_text_color').options.selectedIndex].value");
	var label_back_color = webView.evalJS("document.getElementById('label_back_color').options[document.getElementById('label_back_color').options.selectedIndex].value");
	var label_text = webView.evalJS("document.getElementById('memo_text').value");
	
    //webView.evalJS("document.getElementById('memo_text').value = '"  + label_text_color + "'");
    
    Titanium.API.debug("selectDropdownList click. text color:" + label_text_color
    	+  ' back:' + label_back_color
    	+ ' text:' + label_text);
    
    
    Titanium.App.Properties.setString("label_text",label_text);
    Titanium.App.Properties.setString("label_text_color",label_text_color);
    Titanium.App.Properties.setString("label_back_color",label_back_color);
	/*
	if((label_x === 'undefined') || (label_x == null)){
		label_x = 160;
	}
	if((label_y === 'undefined') || (label_y == null)){
		label_y = 290;
	}
	
	Titanium.App.Properties.setInt("label_x",label_x);
	Titanium.App.Properties.setInt("label_y",label_y);

	var date = new Date();
    var reg_date = date.getFullYear() + '-' + 
        			zero_pad(date.getMonth()+1) + '-' +
        			zero_pad(date.getDate());
        		
    var reg_time = zero_pad(date.getHours()) + ':' + 
        			zero_pad(date.getMinutes()) + ':' +
        			zero_pad(date.getSeconds());
		
	var db = Ti.Database.open('image.db');
	//すでに存在するラベルの更新
	if((idx != 'undefined') && (idx != null)){
		var sql_str = "UPDATE 't_image_label' SET text_color = ?,back_color = ?,label_memo = ?, \
						entry_date = ?,entry_time = ? \
						WHERE label_index = ? AND photo_id = ?";
		db.execute(sql_str,label_text_color,label_back_color,label_text,
					reg_date,reg_time,idx,photo_id);
	//新規追加
	}else{
		var sql_str = "INSERT INTO 't_image_label' (photo_id,label_index,cur_x,cur_y,\
						text_color,back_color,label_memo,entry_date,entry_time) \
							VALUES(?,?,?,?,?,?,?,?,?)";
		db.execute(sql_str,photo_id,a_memo_ct,label_x,label_y,label_text_color,label_back_color,
					label_text,reg_date,reg_time);
	}
	
	db.close();
	*/
	win.close();
});
/*
Ti.App.addEventListener("deleteItem", function(e){
    Titanium.API.debug("deleteItem click.: " + idx);
    
    Titanium.App.Properties.setInt("delete_index",idx);
    
    var db = Ti.Database.open('image.db');
    var sql_str = "UPDATE 't_image_label' SET text_color = '',back_color = '',label_memo = '' \
						WHERE label_index = ? AND photo_id = ?";
	db.execute(sql_str,idx,photo_id);
	db.close();
					
	win.close();
    
})*/