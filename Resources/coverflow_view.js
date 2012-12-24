var win = Titanium.UI.currentWindow;

var images = [];
var capture_date =[];
var image_memo =[];
var db_array = [];

var navActInd = Titanium.UI.createActivityIndicator();
win.setRightNavButton(navActInd);
navActInd.show();

var s = setInterval(function(){
	Ti.API.debug(win.title + ' timer :' + images.length);
	if( images.length >= win.count){
		Ti.API.debug(win.title + ' timer stop:' + images.length);
		navActInd.hide();
		win.setRightNavButton(null);
		
		clearInterval(s);
		s = null;
	}
}, 100);


var db = Ti.Database.open('image.db');
var sql_str = 'SELECT * FROM t_image ORDER BY id DESC';
var rows = db.execute(sql_str);
while (rows.isValidRow()){
	var jpeg_file_name = rows.fieldByName('filename');
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, jpeg_file_name.substr(0,14) + '.png');
	var fname = file.nativePath;
	Ti.API.debug('images:' + fname);
	images.push(fname);
	
	var t_cap_date = rows.fieldByName('entry_date') + ' ' + rows.fieldByName('entry_time');
	capture_date.push(t_cap_date);
	var t_memo = rows.fieldByName('memo');
	image_memo.push(t_memo);
	
	db_array.push(rows.fieldByName('id'));
	
	rows.next();
}
rows.close();
db.close();
/*	
//画像ファイルを取得
var dir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory);
var filesArray = dir.getDirectoryListing();

//画像ファイルのみを対象に。
for( var j=0 ; j<filesArray.length ; j++ ) {
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filesArray[j]);
	Ti.API.debug('images:' + file.name);
	
	if(file.extension() == "png"){
		var fname = file.nativePath;
		images.push(fname);
		
		var png_file = file.name();
		png_file.substr(0,14) + '.jpg'
		
		image_file_name.push(file.name);
		
		Ti.API.debug('images ' + fname);
	}
}
*/

// create coverflow view with images
var view = Titanium.UI.createCoverFlowView({
	images:images,
	transform: Titanium.UI.create2DMatrix().scale(2.0, 2.0),
	backgroundColor:'#000',
	height:300
});

var date_label = Titanium.UI.createLabel({
	height:20,
	width:320,
	left:0,
	top:0,
	backgroundColor:'#888',
	textAlign:'center',
	color:'white'
});

var memo_label = Titanium.UI.createLabel({
	height:20,
	width:320,
	left:0,
	bottom:0,
	backgroundColor:'#888',
	textAlign:'center',
	color:'white'
});

// click listener - when image is clicked
view.addEventListener('click',function(e)
{
	Titanium.API.debug("image clicked: "+e.index+', selected is '+view.selected);
	var imageWindow = Ti.UI.createWindow(
        {
            url: 'capture_view.js',
            title:capture_date[view.selected],
            image_file:capture_date[view.selected],
			image_id:db_array[view.selected]
        }
    );
    Ti.UI.currentTab.open(imageWindow);
});

view.addEventListener('singletap',function(e)
{
	Titanium.API.debug("image singletap: "+e.index+', selected is '+view.selected);	
});

view.addEventListener('dblclick',function(e)
{
	Titanium.API.debug("image dblclick: "+e.index+', selected is '+view.selected);	
});

view.addEventListener('doubletap',function(e)
{
	Titanium.API.debug("image doubletap: "+e.index+', selected is '+view.selected);	
});

// change listener when active image changes
view.addEventListener('change',function(e)
{
	Titanium.API.info("image changed: "+e.index+', selected is '+view.selected);
	memo_label.text = image_memo[e.index];
	date_label.text = capture_date[e.index];
});

win.add(view);
win.add(memo_label);
win.add(date_label);
// change button to dynamically change the image
var change = Titanium.UI.createButton({
	title:'view',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
change.addEventListener('click',function()
{
	Titanium.API.info("selected is = "+view.selected);
	var imageWindow = Ti.UI.createWindow(
        {
            url: 'capture_view.js',
            title:capture_date[view.selected],
            image_file:capture_date[view.selected],
			image_id:db_array[view.selected]
        }
    );
    Ti.UI.currentTab.open(imageWindow);
    	
});

// move scroll view left
var left = Titanium.UI.createButton({
	image:'./icon_arrow_left.png'
});
left.addEventListener('click', function(e)
{
	var i = view.selected - 1;
	if (i < 0) 
	{
		i = 0;
	}
	view.selected = i;
	memo_label.text = image_memo[i];
	date_label.text = capture_date[i];
});

// move scroll view right
var right = Titanium.UI.createButton({
	image:'./icon_arrow_right.png'
});
right.addEventListener('click', function(e)
{
	var i = view.selected + 1;
	if (i >= images.length) 
	{
		i = images.length - 1;
	}
	view.selected = i;
	memo_label.text = image_memo[i];
	date_label.text = capture_date[i];
});
var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
win.setToolbar([left,flexSpace,change,flexSpace,right]);

memo_label.text = image_memo[0];
date_label.text = capture_date[0];