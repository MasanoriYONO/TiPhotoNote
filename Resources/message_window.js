//app.jsから呼び出される。
var win = Ti.UI.currentWindow;

var db = Ti.Database.open('image.db');
var rows = db.execute('SELECT memo FROM t_image WHERE id = ? LIMIT 1',win.image_id);
while (rows.isValidRow()){
	var memo = rows.fieldByName('memo');
	rows.next();
}
rows.close();
db.close();

var textArea = Ti.UI.createTextArea(
    {
    	value:memo,
        height:150,
        width:300,
        top:10,
        font:{fontSize:20},
        borderWidth:2,
        borderColor:'#bbb',
        borderRadius:5,
        //改行を抑制したい場合はtrue
        suppressReturn:true
    }
);

win.add(textArea);

var addButton = Ti.UI.createButton(
    {
        top: 170,
        right: 10,
        width: 100,
        height: 44,
        title: L("memo_save_text")
    }
);

var alert_dialog = Titanium.UI.createAlertDialog({
	title:win.title,
	message:''
});

addButton.addEventListener(
    'click',function () {
        if ( textArea.value ) {
            var db = Ti.Database.open('image.db');
			db.execute('UPDATE t_image SET memo = ? WHERE id = ?'
						,textArea.value ,win.image_id);
			alert_dialog.message = db.rowsAffected + L("memo_update_message_text");
			alert_dialog.show();
			db.close();
        }
    }
);

win.add(addButton);

var closeButton = Ti.UI.createButton(
    {
        top: 170,
        left: 10,
        width: 100,
        height: 44,
        title: L("memo_close_text")
    }
);

closeButton.addEventListener(
    'click',function () {
    	win.close({animated:true}); //この行を追加
    }
);

win.add(closeButton);