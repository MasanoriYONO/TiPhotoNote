//camera capture from app.js, and make image file local directory.
//This file makes list of image files in local directory.

var win = Ti.UI.currentWindow;

var dir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory);
//var dir = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory);

var filesArray = dir.getDirectoryListing();

//alert(filesArray);
						
//配列に格納してテーブルにリスト表示する。
var data = [];
var db_array = [];

//画像ファイルのみを対象に。
for( var i=0 ; i<filesArray.length ; i++ ) {
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filesArray[i]);

	//if(file.extension() == "png"){
		var t_data = Ti.UI.createTableViewRow(
			{
				title:file.name
			});
		data.push(t_data);
	//}
}

// create table view
var tableview = Titanium.UI.createTableView({
	data:data,
	editable:true,
	allowsSelectionDuringEditing:true
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
	// event data
	var index = e.index;
	var section = e.section;
	var row = e.row;
	var rowdata = e.rowData;
	//Titanium.UI.createAlertDialog({title:'Table View',message:'row ' + row + ' index ' + index + ' section ' + section  + ' title ' + rowdata.title}).show();
	
	/*
	var imageWindow = Ti.UI.createWindow(
        {
            url: 'capture_view.js',
            title:rowdata.title,
            image_file:rowdata.title,
            image_id:db_array[e.index]
        }
    );
    Ti.UI.currentTab.open(imageWindow);
    */    
});

// add delete event listener
tableview.addEventListener('delete',function(e)
{
	var s = e.section;
	//Ti.API.info('rows ' + s.rows + ' rowCount ' + s.rowCount + ' headerTitle ' + s.headerTitle + ' title ' + e.rowData.title);

	//Titanium.API.info("deleted - row="+e.row+", index="+e.index+", section="+e.section + ' foo ' + e.rowData.foo);
	//file unlink.
	var image_file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,e.rowData.title);
	image_file.deleteFile();
	
});


// add table view to the window
win.add(tableview);

//
//  create edit/cancel buttons for nav bar
//
var edit = Titanium.UI.createButton({
	title:'Edit'
});

edit.addEventListener('click', function()
{
	win.setRightNavButton(cancel);
	tableview.editing = true;
});

var cancel = Titanium.UI.createButton({
	title:'Cancel',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});
cancel.addEventListener('click', function()
{
	win.setRightNavButton(edit);
	tableview.editing = false;
});

win.setRightNavButton(edit);