//app.jsから呼び出される。
var win = Ti.UI.currentWindow;

var db = Ti.Database.install('./image.db','image.db');

var data = [
	{title:'撮る', hasChild:true, color:'red', selectedColor:'#fff'},
	{title:'日付一覧', hasDetail:true, color:'green', selectedColor:'#fff'},
	{title:'メモあり一覧', hasDetail:true, color:'blue', selectedColor:'#fff'}
/*
	{title:'DBリカバリ', color:'orange', selectedColor:'#fff'},
	{title:'DBインストール', color:'red', selectedColor:'#fff'},
	{title:'DB削除', color:'red', selectedColor:'#fff'},
	{title:'ファイル管理', hasDetail:true, color:'blue', selectedColor:'#fff'}
*/	
];

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
	Ti.API.info('detail ' + e.detail);
	//Titanium.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata}).show();
	switch( e.index ) {
    case 0:
        var capWindow = Ti.UI.createWindow(
        	{
                url: 'capture.js',
                title:'撮影する'
        	}
        );
        Ti.UI.currentTab.open(capWindow);
        
        break;
    case 1:
		var imageListWindow = Ti.UI.createWindow(
        	{
                url: 'capture_list3.js',
                title:'日付一覧',
                memo:false
        	}
        );
        Ti.UI.currentTab.open(imageListWindow);
        break;
    case 2:
		var memoListWindow = Ti.UI.createWindow(
        	{
                url: 'capture_list3.js',
                title:'メモあり一覧',
                memo:true
        	}
        );
        Ti.UI.currentTab.open(memoListWindow);
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