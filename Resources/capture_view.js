var win = Titanium.UI.currentWindow;

//テーブルが存在しなければ作成。
var db = Ti.Database.open('image.db');
var sql_str = "CREATE TABLE IF NOT EXISTS 't_image_label' (id INTEGER PRIMARY KEY AUTOINCREMENT,\
					photo_id INTEGER,label_index INTEGER,cur_x INTEGER,cur_y INTEGER,text_color TEXT,\
					text_size INTEGER,back_color TEXT, label_memo TEXT,\
					entry_date TEXT,entry_time TEXT)";
db.execute(sql_str);
db.close();

var alert_dialog = Titanium.UI.createAlertDialog({
	title:win.title,
	message:''
});

var navActInd = Titanium.UI.createActivityIndicator();
win.setRightNavButton(navActInd);
navActInd.show();

var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',

	top:0,
	bottom:0,

	backgroundColor:'gray',

	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:true,

	maxZoomScale:10,
	minZoomScale:0.1
});

//scrollViewの上で拡大縮小やスクロールを可能に。
var imageView = Titanium.UI.createImageView(
    {
    	//image:image_file,
        //width: 1200,
        //height: 1600,
        width: 'auto',
        height: 'auto',  
        top:0,
 		left:0
 		//zoomScale = 0.267;
    }
);

// scrollView.add(imageView);
// win.add(scrollView);

var filename;
var memo_text;
var entry_date_time;
var db = Ti.Database.open('image.db');
var rows = db.execute('SELECT * FROM t_image WHERE id = ? LIMIT 1',win.image_id);
while (rows.isValidRow()){
	filename = rows.fieldByName('filename');
	memo_text = rows.fieldByName('memo');
	entry_date_time = rows.fieldByName('entry_date') + ' ' + rows.fieldByName('entry_time');
	rows.next();
}
rows.close();
db.close();
	
var image_file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
imageView.image = image_file.nativePath;

imageView.addEventListener('load', function()
{
	//画像の向きを判定
	Ti.API.debug('image size width:' + imageView.size.width + ' height:' + imageView.size.height);
	Ti.API.debug('scrollView contentWidth:' + scrollView.contentWidth + ' contentHeight:' + scrollView.contentHeight);
	Ti.API.debug('image top:' + imageView.top + ' left:' + imageView.left);
	//iphone4だと大きさが違うと思う。
	// Ti.API.debug('currentWindow.width:' + currentWindow.width);
	Ti.API.debug('Titanium.Platform.displayCaps.platformWidth:' + Titanium.Platform.displayCaps.platformWidth);
	scrollView.zoomScale = Titanium.Platform.displayCaps.platformWidth / imageView.size.width;
	Ti.API.debug('scrollView.zoomScale:' + scrollView.zoomScale);
	//scrollView_item.width = imageView.width * scrollView.zoomScale;
	//scrollView_item.height = imageView.height * scrollView.zoomScale;
	/*
	if(imageView.size.width < imageView.size.height){
		scrollView.zoomScale = 0.267;
	}else{
		scrollView.zoomScale = 0.2;	
	}
	*/
	navActInd.hide();
});



var memo_label = Titanium.UI.createLabel({
	id:'memo_label',
	text:memo_text,
	width:1200,
	height:80,
	top:10,
	left:10,
	font:{fontSize:50},
	color:'white',
	opacity:0.5,
	textAlign:'left'
});

var date_label = Titanium.UI.createLabel({
	id:'date_label',
	text:entry_date_time,
	width:1200,
	height:80,
	bottom:10,
	right:10,
	font:{fontSize:50},
	color:'white',
	opacity:0.5,
	textAlign:'right'
});

var item_label = Titanium.UI.createLabel({
	width:'auto',
	height:'auto',
	borderColor:'transparent',
	borderWidth:1,
	//backgroundColor:label_back_color,
	font:{fontSize:50},
	textAlign:'center',
	//text:'sample',
	//color:label_text_color,
	opacity:1.0
});
		
var item_view = Titanium.UI.createView({
	width:imageView.width,
	height:imageView.height,
	//backgroundColor:'blue',
	//borderColor:'transparent',
	//borderWidth:1,
	opacity:1.0
});

var scrollView_item = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
//表示対象のビューの大きさを指定する。自分より大きい領域を表示するためなので、自分自身よりも大きくなる。
//自分より小さいとスクロールしない。そういうものなので。
//	contentWidth:960.0,
//	contentHeight:960.0,

	contentOffset:{x:0,y:0},
	top:0,
	left:0,
	//今のtitaniumでは取得できなかった。
	// width: win.width,
	// height: win.height,
	width: Titanium.Platform.displayCaps.platformWidth,
	height: Titanium.Platform.displayCaps.platformHeight,
	
	//borderColor:'transparent',
	//borderWidth:1,
	//showVerticalScrollIndicator:true,
	//showHorizontalScrollIndicator:true,
	backgroundColor:'blue',
	opacity:0.1,
	maxZoomScale:2.0,
	minZoomScale:0.1
});

item_view.add(item_label);
item_label.center = item_view.center;
scrollView_item.add(item_view);
win.add(scrollView_item);
//scrollView_item.hide();

imageView.addEventListener('touchstart', function(e)
{
	Ti.API.debug('imageView touchstart.:' + e.source.getParent().getParent().title
			+ ' x:' + e.x + ' y:' +e.y + ' type:' + e.type
			+ ' globalPoint.x:' + e.globalPoint.x + ' globalPoint.y:' +e.globalPoint.y);
	//ScrollViewで拡大縮小するので画面上の絶対座標ではなく、imageViewの上の座標が必要と思われる。
	//Ti.App.fireEvent('touch_continue', {timer:'start',x:e.globalPoint.x,y:e.globalPoint.y});
	//時刻表示やメモ表示のラベルの上であれば長押し監視のタイマをスタートさせない。
	if(e.source.getParent().getParent().title == win.title){
		Ti.App.fireEvent('touch_continue', {timer:'start',x:e.x,y:e.y});
	}
});

imageView.addEventListener('touchmove', function(e)
{
	Ti.API.debug('imageView touchmove.:' + e.source  
			+ ' x:' + e.x + ' y:' +e.y + ' type:' + e.type);
	//Ti.App.fireEvent('touch_continue', {timer:'stop'});
});

imageView.addEventListener('touchend', function(e)
{
	Ti.API.debug('imageView touchend.:' + e.source  
			+ ' x:' + e.x + ' y:' +e.y + ' type:' + e.type);
	//Ti.App.fireEvent('touch_continue', {timer:'stop'});
});

imageView.addEventListener('click', function(e)
{
	Ti.API.debug('imageView click.:' + e.source  
			+ ' x:' + e.x + ' y:' +e.y + ' type:' + e.type);
	//Ti.App.fireEvent('touch_continue', {timer:'stop'});
});

imageView.addEventListener('dblclick', function(e)
{
	Ti.API.debug('imageView dblclick.:' + e.source  
			+ ' x:' + e.x + ' y:' +e.y + ' type:' + e.type);
	//Ti.App.fireEvent('touch_continue', {timer:'stop'});
});

/*
scrollView.addEventListener('touchstart', function(e)
{
	Ti.API.debug('scrollView touchstart.'
			+ ' e.x:' + e.x + ' e.y:' + e.y
			+ ' e.globalPoint.x:' + e.globalPoint.x
			+ ' e.globalPoint.y:' + e.globalPoint.y
			);
	Ti.App.fireEvent('touch_continue', {timer:'stop'});
});
*/
/*
var timer_interrupt;
var touch_continue_timer;
var array_memo_label = [];
Ti.App.addEventListener("touch_continue", function(e){
	if(e.timer =='start'){
		timer_interrupt = false;
		Ti.API.debug('touch_continue: timer start.');
		touch_continue_timer = setTimeout(function(){
			if(!timer_interrupt){
				Ti.API.info('touch_continue: timer count up.');
				if(array_memo_label.length == 0){
					navActInd.show();
					setLabelFromDB();
					navActInd.hide();
				}
				var memo_window = Titanium.UI.createWindow({
					url:'memo_view_html.js',
					image_id:win.image_id,
					a_memo_ct:array_memo_label.length,
					backgroundColor:'#fff',
					label_x:e.x,
					label_y:e.y
				});
				Ti.UI.currentTab.open(memo_window,{animated:true});
		
			}else{
				clearTimeout(touch_continue_timer);
				touch_continue_timer = null;
				Ti.API.debug('touch_continue: timer interrupt.');
			}
		}, 1200);
	}else if(e.timer =='stop'){
		clearTimeout(touch_continue_timer);
		touch_continue_timer = null;
		timer_interrupt = true;
		Ti.API.debug('touch_continue: recieve timer stop event.');
	}
});
*/
function setLabel(){
//	var delete_index = Titanium.App.Properties.getInt("delete_index");
//	var label_index = Titanium.App.Properties.getInt("label_index");
	var label_text = Titanium.App.Properties.getString("label_text");
	var label_text_color = Titanium.App.Properties.getString("label_text_color");
	var label_back_color = Titanium.App.Properties.getString("label_back_color");
	
//	var label_x = Titanium.App.Properties.getInt("label_x");
//	var label_y = Titanium.App.Properties.getInt("label_y");
	
	Titanium.API.debug("setLabel:text "+ label_text + ' type:' + typeof(label_text)
					+ " label_text_color:"+ label_text_color + ' type:' + typeof(label_text_color)
					+ " label_back_color:"+ label_back_color + ' type:' + typeof(label_back_color)
//					+ " label_index: "+ label_index + ' type:' + typeof(label_index)
//					+ " delete_index: "+ delete_index + ' type:' + typeof(delete_index)
//					+ " label_x: "+ label_x + ' type:' + typeof(label_x)
//					+ " label_y: "+ label_y + ' type:' + typeof(label_y)
					);
	
//	Titanium.App.Properties.removeProperty("label_index");
//	Titanium.App.Properties.removeProperty("delete_index");
	Titanium.App.Properties.removeProperty("label_text");
	Titanium.App.Properties.removeProperty("label_text_color");
	Titanium.App.Properties.removeProperty("label_back_color");
//	Titanium.App.Properties.removeProperty("label_x");
//	Titanium.App.Properties.removeProperty("label_y");
					
	if(label_text == null){
		return;
	}
	
		
	item_label.text=label_text;
	item_label.backgroundColor=label_back_color;
	item_label.color=label_text_color;
			
}
/*
function setLabelInitialize(label_text_color,label_back_color,label_memo,label_x,label_y,l_index){
	var a_memo_image = Titanium.UI.createLabel({
		width:'auto',
		height:'auto',
		borderColor:'transparent',
		borderWidth:1,
		backgroundColor:label_back_color,
		font:{fontSize:30},
		textAlign:'center',
		color:label_text_color,
		text:label_memo,
		opacity:1.0
	});
	
	array_memo_label.push(a_memo_image);
				
	Titanium.API.debug("array_memo_label@setLabelFromDB  add: "+ typeof(l_index) + '->' + l_index);
		
	imageView.add(array_memo_label[l_index]);
	array_memo_label[l_index].show();
	array_memo_label[l_index].center = {x:label_x,y:label_y};
		
	label_memo = label_memo.replace(/(^\s+)|(\s+$)/g, "");
		
	Titanium.API.debug("label_text@setLabelFromDB :"+ typeof(label_memo) + '->' + label_memo);
	
	array_memo_label[l_index].addEventListener('dblclick', function(e){
		Titanium.API.debug("array_memo_label@setLabelFromDB  dblclick: "+ l_index
			+ ':' + e.source + ' x:' + e.x + ' y:' + e.y + ' type:' + e.type);
		Ti.App.fireEvent('touch_continue@setLabelFromDB ', {timer:'stop'});
			
		var memo_window = Titanium.UI.createWindow({
			url:'memo_view_html.js',
			memo:array_memo_label[l_index].text,
			image_id:win.image_id,
			a_memo_ct:array_memo_label.length,
			idx:l_index,
			text_color:array_memo_label[l_index].color,
			back_color:array_memo_label[l_index].backgroundColor,
			backgroundColor:'#fff'
		});
		Ti.UI.currentTab.open(memo_window,{animated:true});
	});
	
	Titanium.API.debug("array_memo_label@setLabelInitialize addEventListener: "+ l_index);
}

function setLabelFromDB(){
	//DBのラベルを表示する。
	var db = Ti.Database.open('image.db');
	
	var rows = db.execute("SELECT id FROM t_image_label WHERE photo_id = ? and \
				label_memo !='' ORDER BY label_index DESC",win.image_id);
	
	var label_index_count = rows.rowCount -1;
	Ti.API.debug('rows:' + label_index_count);
	
	while (rows.isValidRow()){
		var id = rows.fieldByName('id');
		db.execute("UPDATE t_image_label SET label_index = ? WHERE id = ?",label_index_count,id);
		Ti.API.debug('rows id:' + id);
		label_index_count--;
		rows.next();
	}
	rows.close();
	
	db.execute("DELETE FROM t_image_label WHERE photo_id = ? and label_memo ='' ",win.image_id);
	db.execute("VACUUM");
	
	var rows = db.execute("SELECT * FROM t_image_label WHERE photo_id = ? and \
				label_memo !='' ORDER BY label_index",win.image_id);
	while (rows.isValidRow()){
		var label_text_color = rows.fieldByName('text_color');
		var label_back_color = rows.fieldByName('back_color');
		var label_memo = rows.fieldByName('label_memo');
		var label_x = rows.fieldByName('cur_x');
		var label_y = rows.fieldByName('cur_y');
		var l_index = rows.fieldByName('label_index');
		
		setLabelInitialize(label_text_color,label_back_color,label_memo,label_x,label_y,l_index);
		rows.next();	

	}
	rows.close();
	db.close();
}
*/
imageView.add(memo_label);
imageView.add(date_label);

memo_label.hide();
date_label.hide();


var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var b_memo_show_hide = Titanium.UI.createButton({
	//systemButton:Titanium.UI.iPhone.SystemButton.ADD
	title:'show',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

b_memo_show_hide.addEventListener('click', function(e)
{
	if(memo_label.visible){
		memo_label.hide();
		date_label.hide();
		b_memo_show_hide.title='show';
	}else{
		memo_label.show();
		date_label.show();
		b_memo_show_hide.title='hide';
	}
});

var b_add2photo = Titanium.UI.createButton({
	title:'add',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

b_add2photo.addEventListener('click', function(e)
{
	var memo_window = Titanium.UI.createWindow({
			url:'memo_view_html.js',
			//image_id:win.image_id,
			//a_memo_ct:array_memo_label.length,
			backgroundColor:'#fff',
			label_x:e.x,
			label_y:e.y
		});
	Ti.UI.currentTab.open(memo_window,{animated:true});			
});

var b_undo_image = Titanium.UI.createButton({
	//systemButton:Titanium.UI.iPhone.SystemButton.CONTACT_ADD
	title:'undo',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});

b_undo_image.addEventListener('click', function(e)
{
	//imageView.image=imageView_back.toBlob();
	imageView.image=undo_image;
	
});

var b_put_image = Titanium.UI.createButton({
	//systemButton:Titanium.UI.iPhone.SystemButton.CONTACT_ADD
	title:'put',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

var undo_image;
b_put_image.addEventListener('click', function(e)
{
	imageView.add(item_view);
	undo_image=imageView.toBlob();
	//var temp_image = imageView.toImage();
	//imageView.image=temp_image;	
	//temp_image = null;
	
	imageView.image = imageView.toImage();
	
	imageView.remove(item_view);
});

var b_mail = Titanium.UI.createButton({
	//systemButton:Titanium.UI.iPhone.SystemButton.ACTION
	title:'mail',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

b_mail.addEventListener('click', function()
{
	//Titanium.UI.createAlertDialog({title:'System Button', message:'ACTION'}).show();
	/*
	var mailWindow = Ti.UI.createWindow(
        {
            url: 'mail.js',
            title: L("memo_title_text"),
            image_id:win.image_id,
			backgroundColor: '#fff'
        }
    );
    Ti.UI.currentTab.open(mailWindow,{animated:true});
    */
    //メール機能はシュミレータでは動作しない。実機で確認。
    var emailDialog = Titanium.UI.createEmailDialog();
    emailDialog.setBarColor('#999');
    
	Ti.API.debug(win.title + ' action:');
    if (!emailDialog.isSupported()) {
    	Ti.API.debug(win.title + ' action:Email not available.');
    	
        alert_dialog.message = 'Email not available';
		alert_dialog.show();
        return;
    }
    
    emailDialog.setSubject('[TiPhotoMemo Mail]:' + entry_date_time + ' captured.');
    //emailDialog.setToRecipients(['myono.c50@gmail.com']);
    //emailDialog.setCcRecipients(['bar@yahoo.com']);
    //emailDialog.setBccRecipients(['blah@yahoo.com']);
	if(memo_text){
    	var memo_mes = "Your photo memo is \n\n" +  memo_text;
    }else{
    	var memo_mes = "photo memo is not set.";
    }
	
    if (Ti.Platform.name == 'iPhone OS') {
        emailDialog.setMessageBody(memo_mes);
        emailDialog.setHtml(false);
    } else {
        emailDialog.setMessageBody(memo_mes);
    }

    // attach a blob
    //emailDialog.addAttachment(imageView.image);
        
    // attach a file
    emailDialog.addAttachment(image_file);
    
    emailDialog.addEventListener('complete',function(e)
        {
        if (e.result == emailDialog.SENT){
            if (Ti.Platform.osname != 'android') {
        	    // android doesn't give us useful result codes.
                // it anyway shows a toast.

                alert_dialog.message = 'message was sent.';
				alert_dialog.show();
            }
        }else if(e.result == emailDialog.CANCELLED){

        }else{
        	alert("message was not sent. " + e.result);
        }
    });
    emailDialog.open();
});


var b_save2roll = Titanium.UI.createButton({
	//systemButton:Titanium.UI.iPhone.SystemButton.ORGANIZE
	title:'to roll',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

b_save2roll.addEventListener('click', function()
{
	//Titanium.UI.createAlertDialog({title:'System Button', message:'ORGANIZE'}).show();
	//image save to photogallery.
	
	//win.setRightNavButton(navActInd);
	navActInd.show();
	
	Titanium.Media.saveToPhotoGallery(imageView.toImage(),{
		success: function(e) {
			alert_dialog.message = L("add_photogallery_message_text");
			alert_dialog.show();
	
			navActInd.hide();
			//win.setRightNavButton(null);
		},
		error: function(e) {
			Titanium.UI.createAlertDialog({
				title:'Error saving',
				message:e.error
			}).show();
			navActInd.hide();
			//win.setRightNavButton(null);
		}
	});
});

var b_memo = Titanium.UI.createButton({
	//systemButton:Titanium.UI.iPhone.SystemButton.COMPOSE
	title:'memo',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

b_memo.addEventListener('click', function()
{
	var messageWindow = Ti.UI.createWindow(
        {
            url: 'message_window.js',
            title: L("memo_title_text"),
            image_id:win.image_id,
			backgroundColor: '#fff'
        }
    );
    Ti.UI.currentTab.open(messageWindow,{animated:true});
});

win.addEventListener('focus', function(e)
{
	Ti.API.debug(win.title + ' focus.');
	
	var db = Ti.Database.open('image.db');
	var rows = db.execute('SELECT * FROM t_image WHERE id = ? LIMIT 1',win.image_id);
	while (rows.isValidRow()){
		//filename = rows.fieldByName('filename');
		memo_text = rows.fieldByName('memo');
		entry_date_time = rows.fieldByName('entry_date') + ' ' + rows.fieldByName('entry_time');
		rows.next();
	}
	rows.close();
	db.close();
	
	memo_label.text = memo_text;
	date_label.text = entry_date_time;
	
	setLabel();
	
	scrollView_item.show();
	//scrollView.scrollTo(win.width/2,win.height/2);
});

win.addEventListener('blur', function(e)
{
	Ti.API.debug(win.title + ' blur.' );
	
	//imageView.remove(memo_label);
	//imageView.remove(date_label);
});

win.addEventListener('open', function(e)
{
	Ti.API.debug(win.title + ' open.');
	
	scrollView.add(imageView);
    win.add(scrollView);
	
	// win.toolbar = [b_memo,flexSpace,b_mail,flexSpace,b_memo_show_hide,
			// flexSpace,b_add2photo,flexSpace,b_put_image,flexSpace,b_undo_image];
	win.toolbar = [b_memo,flexSpace,b_mail,flexSpace,b_memo_show_hide];
	win.setRightNavButton(b_save2roll);
	
});

win.addEventListener('close', function(e)
{
	Ti.API.debug(win.title + ' close.');
	
	Ti.API.debug(win.title + ' close.' + 'array_memo_label:' + typeof(array_memo_label));
	for(var i=0,j=array_memo_label.length;i<j;i++){
		array_memo_label[i] = null;
		Ti.API.debug(win.title + ' close.' + 'array_memo_label[' + i + '] set null:' + typeof(array_memo_label[i]));
	}
	
	Ti.API.debug(win.title + ' close.' + 'emailDialog:' +typeof(emailDialog));
	Ti.API.debug(win.title + ' close.' + 'imageView.image:' + typeof(imageView.image));
	imageView = null;
	if(typeof(emailDialog) !== 'undefined'){
		emailDialog = null;
	}
});
