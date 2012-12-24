//camera capture from app.js, and make image file local directory.
//This file makes list of image files in local directory.

var win = Ti.UI.currentWindow;

var alert_dialog = Titanium.UI.createAlertDialog({
	title:win.title,
	message:''
});

var hint_message = '';
var sql_str = '';
	
if(win.memo){
	hint_message = L("memo_search_hint_text");
	sql_str = 'SELECT * FROM t_image WHERE memo IS NOT NULL ORDER BY id DESC';
}else{
	hint_message = L("date_search_hint_text");
	sql_str = 'SELECT * FROM t_image ORDER BY id DESC';
}
	
var search_bar = Titanium.UI.createSearchBar({
	barColor:win.barColor,
	showCancel:false,
	hintText:hint_message
});

search_bar.addEventListener('change', function(e){
	e.value; // search string as user types
});
search_bar.addEventListener('return', function(e){
	search_bar.blur();
});
search_bar.addEventListener('cancel', function(e){
	search_bar.blur();
});
// カスタムイベント「set_color」を設定しておきます。
search_bar.addEventListener('set_color', function(e){
    search_bar.barColor = win.barColor;
});

var data = [];
var db_array = [];

// create table view
var tableView = Titanium.UI.createTableView({
	data:data,
	editable:true,
	allowsSelectionDuringEditing:true,
	search:search_bar,
	filterAttribute:'filter',
	searchHidden:true
});

var actInd = Titanium.UI.createActivityIndicator({
	bottom:10, 
	height:50,
	width:10,
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
});

function setData()
{
	//配列に格納してテーブルにリスト表示する。
	
	var db = Ti.Database.open('image.db');
	
	var rows = db.execute(sql_str);
	while (rows.isValidRow()){
		
		var t_data = Ti.UI.createTableViewRow({
			layout: 'absolute',
			backgroundColor:'#fff',
			selectedBackgroundColor:'#ddd',
			height:90,
			className:'datarow',
			clickName:'row',
			text:rows.fieldByName('entry_date') + " " + rows.fieldByName('entry_time')
		});
	
		//thumbnail image.
		var thumb_file = rows.fieldByName('filename');
		var tf = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, thumb_file.substr(0,14) + '.png');
		//var tf = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, thumb_file);
		//var tf = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'thumbnail.png');
	
		var thumb_photo = Ti.UI.createImageView({
			//image:'./user.png',
			image:tf.nativePath,
			top:5,
			left:5,
			//width:60,
			//height:80,
			width:'auto',
			height:'auto',
			clickName:'thumb_photo'
		});
		if(thumb_photo.size.width < thumb_photo.size.height){
			thumb_photo.width=60;
			thumb_photo.height=80;	
		}else{
			thumb_photo.top=22.5;
			thumb_photo.width=60;
			thumb_photo.height=45;
		}
		t_data.add(thumb_photo);
	
	
		var filename = Ti.UI.createLabel({
			color:'#576996',
			font:{fontSize:16,fontWeight:'bold', fontFamily:'Arial'},
			left:70,
			top:2,
			height:18,
			width:215,
			clickName:'filename',
			highlightedColor: '#fff',
			text:rows.fieldByName('filename')
		});
		if(!win.memo){
			t_data.filter = filename.text;
		}
		//t_data.filter = filename.text;
		t_data.add(filename);

		var fontSize = 14;
		var memo = Ti.UI.createLabel({
			color:'#222',
			backgroundColor:'#fcfcfc',
			font:{fontSize:fontSize,fontWeight:'normal', fontFamily:'Arial'},
			left:70,
			top:20,
			height:50,
			width:195,
			clickName:'memo',
			highlightedColor: '#00f',
			text:rows.fieldByName('memo')
		});
		if(win.memo){
			t_data.filter = memo.text;
		}
		t_data.add(memo);

		var button = Ti.UI.createView({
			backgroundImage:'./icon_arrow_right.png',
			backgroundColor:'#00f',
			top:30,
			right:5,
			width:30,
			clickName:'button',
			height:30
		});
		t_data.add(button);

		var date = Ti.UI.createLabel({
			color:'#999',
			font:{fontSize:12,fontWeight:'normal', fontFamily:'Arial'},
			left:70,
			bottom:5,
			height:15,
			width:215,
			clickName:'date',
			highlightedColor: '#fff',
			text:rows.fieldByName('entry_date') + " " + rows.fieldByName('entry_time') 
		});
		
		t_data.add(date);
	
		data.push(t_data);
		db_array.push(rows.fieldByName('id'));

		rows.next();
	}
	rows.close();
	db.close();
	
	tableView.setData(data);
	search_bar.barColor = win.barColor;
}

// create table view event listener
tableView.addEventListener('click', function(e)
{
	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	var source = e.source;
	
	//Titanium.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' title ' + rowdata.title}).show();
	switch(source.clickName){
	case "memo":
		var messageWindow = Ti.UI.createWindow(
        	{
            	url: 'message_window.js',
            	title: L("memo_title_text"),
            	image_id:db_array[e.index],
				backgroundColor: '#fff'
        	}
    	);
    	Ti.UI.currentTab.open(messageWindow,{animated:true});
    	
		break;
	default:
		var imageWindow = Ti.UI.createWindow(
        	{
            	url: 'capture_view.js',
            	title:row.text,
            	image_file:row.text,
            	image_id:db_array[e.index]
        	}
    	);
    	Ti.UI.currentTab.open(imageWindow);
    }
});


// add delete event listener
tableView.addEventListener('delete',function(e)
{
	var s = e.section;
	//Ti.API.info('rows ' + s.rows + ' rowCount ' + s.rowCount + ' headerTitle ' + s.headerTitle + ' title ' + e.rowData.title);

	//Titanium.API.info("deleted - row="+e.row+", index="+e.index+", section="+e.section + ' foo ' + e.rowData.foo);
	//file unlink.
	//var image_file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,e.rowData.title);
	//image_file.deleteFile();
	
	var db = Ti.Database.open('image.db');
	////
	var rows = db.execute('SELECT *  FROM t_image WHERE id = ?',db_array[e.index]);
	while (rows.isValidRow()){
		//thumbnail image.
		var image_file = rows.fieldByName('filename');
		var img_jpg = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, image_file);
		img_jpg.deleteFile();
		var img_png = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, image_file.substr(0,14) + '.png');
		img_png.deleteFile();
		rows.next();
	}
	rows.close();
	////
	
	db.execute('DELETE FROM t_image WHERE id = ?',db_array[e.index]);
	
	db_array.splice([e.index],1);
	
	alert_dialog.message = db.rowsAffected + L("delete_message_text");
	alert_dialog.show();
	
	db.close();
	
});


// add table view to the window
win.add(tableView);

//setData();

//navActInd.hide();
//win.setRightNavButton(null);
win.addEventListener('focus', function(e)
{
	Ti.API.debug(win.title + ' focus:' + tableView.data.length);
	
	actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.DARK;
	actInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
	actInd.color = 'gray';
	actInd.message = 'Loading...';
	actInd.width = 210;
	actInd.show();
	win.add(actInd);
				
	//win.toolbar = [search_btn,flexSpace,nativespinner,flexSpace,refresh_btn];
	win.toolbar = [flexSpace,search_btn,flexSpace];
	
	setData();
	
	var s = setInterval(function(){
		Ti.API.debug(win.title + ' win.count :' + win.count);
		Ti.API.debug(win.title + ' timer :' +  data.length);
		if(data.length >= win.count){
			Ti.API.debug(win.title + ' timer stop:' + data.length);
		
			//win.toolbar = [search_btn,flexSpace,refresh_btn];
			
			actInd.message = null;
			actInd.hide();
			win.remove(actInd);
		
			clearInterval(s);
			s = null;
		}else{
			Ti.API.debug(win.title + ' timer don\'t stop:' + data.length);
		}
	}, 100);

	Ti.API.debug(win.title + ' focus:' + tableView.data.length);
});

win.addEventListener('blur', function(e)
{
	Ti.API.debug(win.title + ' blur:' + tableView.data.length);
	
	tableView.setData([]);
	data = [];
	db_array = [];
	
	Ti.API.debug(win.title + ' blur:' + tableView.data.length);
});

win.addEventListener('open', function(e)
{
	Ti.API.debug(win.title + ' open:' + tableView.data.length);
});

win.addEventListener('close', function(e)
{
	Ti.API.debug(win.title + ' close.');
});
//
//  create edit/cancel buttons for nav bar
//
var edit = Titanium.UI.createButton({
	title:'Edit'
});

edit.addEventListener('click', function()
{
	win.setRightNavButton(cancel);
	tableView.editing = true;
});

var cancel = Titanium.UI.createButton({
	title:'Cancel',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});
cancel.addEventListener('click', function()
{
	win.setRightNavButton(edit);
	tableView.editing = false;
});

win.setRightNavButton(edit);

var refresh_btn = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
});

var search_btn = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.SEARCH
});

var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var nativespinner = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.SPINNER
});

refresh_btn.addEventListener('click', function()
{
	tableView.setData([]);
	data = [];
	db_array = [];
	
	setData();
	/*
	setTimeout(function()
	{
		
	},1000);
	*/
});

search_btn.addEventListener('click', function()
{
	if(tableView.searchHidden == true){
		tableView.scrollToTop(0,{animated:true});
		search_bar.fireEvent('set_color', {barColor: '#999' });
	}
});