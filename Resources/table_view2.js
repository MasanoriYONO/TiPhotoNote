//app.jsから呼び出される。
var win = Ti.UI.currentWindow;

var navActInd = Titanium.UI.createActivityIndicator();
win.setRightNavButton(navActInd);
navActInd.show();

var db = Ti.Database.install('./image.db','image.db');

/*
var data = [
	{title:'撮る', hasChild:true, color:'red', selectedColor:'#fff'},
	{title:'日付一覧', hasDetail:true, color:'green', selectedColor:'#fff'},
	{title:'メモあり一覧', hasDetail:true, color:'blue', selectedColor:'#fff'}

	{title:'DBリカバリ', color:'orange', selectedColor:'#fff'},
	{title:'DBインストール', color:'red', selectedColor:'#fff'},
	{title:'DB削除', color:'red', selectedColor:'#fff'},
	{title:'ファイル管理', hasDetail:true, color:'blue', selectedColor:'#fff'}
	
];
*/


var data = [];

function setData(data_i){
	
	var db = Ti.Database.open('image.db');
	switch(data_i){
	case 0:
		var rows = db.execute('SELECT count(id) as cnt FROM t_image');
		var title_txt = L("capture_menu_text");
		var row_color = 'red';
		break;
	case 1:
		var rows = db.execute('SELECT count(id) as cnt FROM t_image');
		var title_txt = L("date_list_menu_text");
		var row_color = 'green';
		break;
	case 2:
		var rows = db.execute('SELECT count(id) as cnt FROM t_image WHERE memo IS NOT NULL');
		var title_txt = L("date_list_with_memo");
		var row_color = 'blue';
		break;
	case 3:
		var rows = db.execute('SELECT COUNT(DISTINCT(entry_date)) AS cnt FROM t_image');
		var title_txt = L("date_group_list");
		var row_color = 'orange';
		break;
	case 4:
		var rows = db.execute('SELECT count(id) as cnt FROM t_image');
		var title_txt = "CoverFlowView";
		var row_color = 'gray';
		break;
	case 5:
		var rows = db.execute('SELECT count(id) as cnt FROM t_image');
		var title_txt = "";
		var row_color = 'gray';
		break;
	case 6:
		var rows = db.execute('SELECT count(id) as cnt FROM t_image');
		var title_txt = "";
		var row_color = 'gray';
		break;
	
	}
	while (rows.isValidRow()){
		switch(data_i){
		case 1:
		case 2:
		case 3:
		case 4:
			var memo_text = rows.fieldByName('cnt');
			var rec_count = rows.fieldByName('cnt');
			break;
		default:
			var memo_text = "";
			var rec_count = 0;
		}
		
		var t_data = Ti.UI.createTableViewRow({
			layout: 'absolute',
			backgroundColor:'#fff',
			selectedBackgroundColor:'#ddd',
			height:45,
			className:'datarow',
			//clickName:'row',
			clickName:rec_count,
			//hasChild:true,
			color:row_color,
			title:title_txt
		});
		
		switch(data_i){
		case 0:
			t_data.header = L("capture_header");
			break;
		case 1:
			//件数を表示
			var memo = Ti.UI.createLabel({
				color:'yellow',
				backgroundColor:'red',
				borderColor:'red',
				borderWidth:1,
				borderRadius:4,
				font:{fontSize:20},
				top:5,
				right:10,
				width:35,
				height:35,
				textAlign:'center',
				//clickName:'memo',
				clickName:rec_count,
				text:memo_text
			});
			
			t_data.add(memo);
			t_data.header = L("data_list_header");
			break;
		case 2:
		case 3:
			//件数を表示
			var memo = Ti.UI.createLabel({
				color:'yellow',
				backgroundColor:'red',
				borderColor:'red',
				borderWidth:1,
				borderRadius:4,
				font:{fontSize:20},
				top:5,
				right:10,
				width:35,
				height:35,
				textAlign:'center',
				//clickName:'memo',
				clickName:rec_count,
				text:memo_text
			});
			
			t_data.add(memo);
			break;
		case 4:
			//オリジナルのヘッダ
			/*
			var header = Ti.UI.createView({
				backgroundColor:'#AAA',
				//opacity:0.8,
				height:'auto'
			});
			var headerLabel = Ti.UI.createLabel({
					font:{fontFamily:'Helvetica Neue',fontSize:18,fontWeight:'bold'},
					text:L("coverflow_header"),
					color:'#fff',
					textAlign:'left',
					top:0,
					left:16,
					width:300,
					height:22
					//shadowOffset:{x:10,y:1},
					//shadowColor:'#fff'
				});
			header.add(headerLabel);
			
			var section_coverflow = Titanium.UI.createTableViewSection();
			section_coverflow.headerView = header;
			section_coverflow.add(t_data);
			*/
			t_data.header = L("coverflow_header");
			break;
		case 5:
			//titleが長いので。
			var memo = Ti.UI.createLabel({
				color:'gray',
				backgroundColor:'#fff',
				selectedBackgroundColor:'#ddd',
				font:{fontSize:14},
				top:0,
				left:10,
				width:320,
				height:45,
				textAlign:'left',
				//clickName:'memo',
				clickName:rec_count,
				text:L("photo2gallery")
			});
			
			t_data.add(memo);
			t_data.header = L("data_operation_header");
			break;
		case 6:
			//titleが長いので。
			var memo = Ti.UI.createLabel({
				color:'red',
				backgroundColor:'#fff',
				selectedBackgroundColor:'#ddd',
				font:{fontSize:14,fontWeight:'bold'},
				top:0,
				left:10,
				width:320,
				height:45,
				textAlign:'left',
				//clickName:'memo',
				clickName:rec_count,
				text:L("delete_text")
			});
			
			t_data.add(memo);
			break;
		}
		/*
		switch(data_i){
		case 4:
			data.push(section_coverflow);
			break;
		default:
			data.push(t_data);
		}
		*/
		data.push(t_data);
		rows.next();
	}
	rows.close();
	db.close();
}

/*
win.addEventListener('open', function(e)
{
	Ti.API.info('win open');
	tableView.setData([]);
	data = [];
	setData(0);
	setData(1);
	setData(2);
	tableView.setData(data);
});
*/
win.addEventListener('focus', function(e)
{
	Ti.API.debug(win.title + ' focus:' + tableView.data.length);
	
	setData(0);
	setData(1);
	setData(2);
	setData(3);
	setData(4);
	setData(5);
	setData(6);
	
	tableView.setData(data);
	
	Ti.API.debug(win.title + ' focus:' + tableView.data.length);

});

win.addEventListener('blur', function(e)
{
	Ti.API.debug(win.title + ' blur:' + tableView.data.length);
	
	tableView.setData([]);
	data = [];
	
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

var tableView = Ti.UI.createTableView({
    data:data
});

var alert_dialog = Titanium.UI.createAlertDialog({
	title:win.title,
	message:''
});

// create table view event listener
tableView.addEventListener('click', function(e)
{
	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	var source = e.source;
	
	Ti.API.debug('source ' + source.clickName);
	switch( e.index ) {
    case 0:
        var capWindow = Ti.UI.createWindow(
        	{
                url: 'capture.js',
                title:L("capture_menu_text")
        	}
        );
        Ti.UI.currentTab.open(capWindow);
        
        break;
    case 1:
		var imageListWindow = Ti.UI.createWindow(
        	{
                url: 'capture_list3.js',
                title:L("date_list_menu_text"),
                count:source.clickName,
                memo:false
        	}
        );
        Ti.UI.currentTab.open(imageListWindow);
        break;
    case 2:
		var memoListWindow = Ti.UI.createWindow(
        	{
                url: 'capture_list3.js',
                title:L("date_list_with_memo"),
                count:source.clickName,
                memo:true
        	}
        );
        Ti.UI.currentTab.open(memoListWindow);
        break;
    case 3:
		var memoListWindow = Ti.UI.createWindow(
        	{
                url: 'capture_date_list.js',
                title:L("date_group_list"),
                count:source.clickName
        	}
        );
        Ti.UI.currentTab.open(memoListWindow);
        break;
    case 4:
    	var coverFlowView = Ti.UI.createWindow(
        	{
                url: 'coverflow_view.js',
                title:"CoverFlowView",
                count:source.clickName
        	}
        );
        Ti.UI.currentTab.open(coverFlowView);
    	break;
    case 5:
    	var alertDialog = Titanium.UI.createAlertDialog({
    			title: win.title,
    			message: L('photo2gallery_dialog'),
    			buttonNames: ['CANCEL','OK'],
    			// キャンセルボタンがある場合、何番目(0オリジン)のボタンなのかを指定できます。
    			cancel: 0
			});

		alertDialog.addEventListener('click',function(event){
    		// Cancelボタンが押されたかどうか
    		if(event.cancel){
		    // cancel時の処理
    		}
    		// 選択されたボタンのindexも返る
			if(event.index == 1){
        		var photo2galleryWindow = Ti.UI.createWindow(
        			{
                		url: 'photo2gallery.js',
                		title:L("photo2gallery"),
                		count:source.clickName
        			}
        		);
        		Ti.UI.currentTab.open(photo2galleryWindow);
    		}
		});
		alertDialog.show();
		
        break;
	case 6:
    	var alertDialog_delete = Titanium.UI.createAlertDialog({
    			title: L('delete_text'),
    			message: L('delete_dialog'),
    			buttonNames: ['CANCEL','OK'],
    			// キャンセルボタンがある場合、何番目(0オリジン)のボタンなのかを指定できます。
    			cancel: 0
			});
			
		var alertDialog_delete_final = Titanium.UI.createAlertDialog({
    			title: L('delete_dialog_again_title'),
    			message: L('delete_dialog_again'),
    			buttonNames: ['CANCEL','OK'],
    			// キャンセルボタンがある場合、何番目(0オリジン)のボタンなのかを指定できます。
    			cancel: 0
			});
			
		alertDialog_delete.addEventListener('click',function(event){
    		// Cancelボタンが押されたかどうか
    		if(event.cancel){
		    // cancel時の処理
    		}
    		// 選択されたボタンのindexも返る
			if(event.index == 1){
        		alertDialog_delete_final.show();
    		}
		});
		
		alertDialog_delete_final.addEventListener('click',function(event){
    		// Cancelボタンが押されたかどうか
    		if(event.cancel){
		    // cancel時の処理
    		}
    		// 選択されたボタンのindexも返る
			if(event.index == 1){
        		//画像ファイルを取得
				var dir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory);
				var filesArray = dir.getDirectoryListing();
				
				//var d_mes ='';
				//画像ファイルのみを対象に。
				for( var i=0 ; i<filesArray.length ; i++ ) {
					var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filesArray[i]);
					
					if((file.extension() == "jpg") || (file.extension() == "png")){
						var fname = file.name;
						//var reg_date = fname.substr(0,4) + '-' + fname.substr(4,2) + '-' + fname.substr(6,2);
						//var reg_time = fname.substr(8,2) + ':' + fname.substr(10,2) + ':' + fname.substr(12,2);
 						//db.execute('INSERT INTO t_image (filename,entry_date,entry_time) VALUES(?,?,?)'
						//	,fname,reg_date,reg_time);
						
						//
						//d_mes = d_mes + fname + '\n';
						
						//実際にはファイルの削除処理。
						file.deleteFile();
					}
				}
				
				//alert(d_mes);
				
				//DB
				var db = Ti.Database.open('image.db');
				db.execute('DELETE FROM t_image');
				db.execute('VACUUM');
				db.close();
				
				alert(L("delete_complete"));
				
				win.fireEvent('blur');
				
				win.fireEvent('focus');
    		}
		});
		
		alertDialog_delete.show();
		
        break;
    
/*
    case 3:
    	//DB
		var db = Ti.Database.open('image.db');
		//db.execute('UPDATE t_image SET b_Image ="", b_Image_size=0');
		
		//画像ファイルを取得
		var dir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory);
		var filesArray = dir.getDirectoryListing();
						
		//画像ファイルのみを対象に。
		for( var i=0 ; i<filesArray.length ; i++ ) {
			var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filesArray[i]);
			if(file.extension() == "jpg"){
				var fname = file.name;
				var reg_date = fname.substr(0,4) + '-' + fname.substr(4,2) + '-' + fname.substr(6,2);
				var reg_time = fname.substr(8,2) + ':' + fname.substr(10,2) + ':' + fname.substr(12,2);
 				db.execute('INSERT INTO t_image (filename,entry_date,entry_time) VALUES(?,?,?)'
							,fname,reg_date,reg_time);
			}
		}

		db.execute('VACUUM');
		alert_dialog.message = "VACUUM COMPLETE.";
		alert_dialog.show();
		
		db.close();
		
    	break;

    case 4:
    	//DB
		var db = Ti.Database.install('./image.db','image.db');
		
		alert_dialog.message = "CREATE DATABASE.";
		alert_dialog.show();
		
    	break;
    case 5:
		var db = Ti.Database.open('image.db');
		db.remove();
		
		alert_dialog.message = "DROP DATABASE.";
		alert_dialog.show();
		
    	break;

    case 6:
		var fileListWindow = Ti.UI.createWindow(
        	{
                url: 'file_list.js',
                title:'ファイル管理'
        	}
        );
        Ti.UI.currentTab.open(fileListWindow);
        break;
*/
    }

});


win.add(tableView);

var s = setInterval(function(){
	Ti.API.debug(win.title + ' timer :' + data.length);
	if( data.length >= 7){
		Ti.API.debug(win.title + ' timer stop:' + data.length);
		navActInd.hide();
		win.setRightNavButton(null);
		
		clearInterval(s);
		s = null;
	}
}, 100);