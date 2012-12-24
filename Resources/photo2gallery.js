//open from capture_list.js
//captured image files are listed on capture_list.js.
//rows image open imageView.

var win = Ti.UI.currentWindow;

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
	minZoomScale:0.15
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

scrollView.add(imageView);
win.add(scrollView);

var memo_label = Titanium.UI.createLabel({
	id:'memo_label',
//	text:memo_text,
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
//	text:entry_date_time,
	width:1200,
	height:80,
	bottom:10,
	right:10,
	font:{fontSize:50},
	color:'white',
	opacity:0.5,
	textAlign:'right'
});
	
var filename =[];
var memo_text =[];
var entry_date_time =[];
var db = Ti.Database.open('image.db');
var rows = db.execute('SELECT * FROM t_image ORDER BY id DESC');
while (rows.isValidRow()){
	filename.push(rows.fieldByName('filename'));
	memo_text.push(rows.fieldByName('memo'));
	entry_date_time.push(rows.fieldByName('entry_date') + ' ' + rows.fieldByName('entry_time'));	
	rows.next();
}
rows.close();
db.close();

var image_count = filename.length;
var image_index = 0;

if(image_count > 0){
	setData(image_index);
}else{
	navActInd.hide();
	alert_dialog.message = L("photo2gallery_no_photo");
	alert_dialog.show();
}

//image view.
function setData(data_i){
	navActInd.show();
	
	imageView.image = null;
	var image_file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename[data_i]);
	imageView.image = image_file.nativePath;
	
	imageView.add(memo_label);
	imageView.add(date_label);
	
	memo_label.text = memo_text[data_i];
	date_label.text = entry_date_time[data_i];
	
	//scrollView.zoomScale = 0.267;
}

imageView.addEventListener('load', function()
{
	//画像の向きを判定
	Ti.API.debug('image size width:' + imageView.size.width + ' height:' + imageView.size.height);
	Ti.API.debug('scrollView contentWidth:' + scrollView.contentWidth + ' contentHeight:' + scrollView.contentHeight);
	Ti.API.debug('image top:' + imageView.top + ' left:' + imageView.left);
	
	
	if(imageView.size.width < imageView.size.height){
		scrollView.zoomScale = 0.267;
	}else{
		scrollView.zoomScale = 0.2;
	}
	
	Titanium.Media.saveToPhotoGallery(imageView.toImage(),{
		success: function(e) {
			navActInd.hide();
			//win.setRightNavButton(null);
			
			image_index++;
			Ti.API.debug('image_index:' + image_index);
			if(image_index > image_count-1){
				alert_dialog.message = L("add_photogallery_message_text");
				alert_dialog.show();
			}else{
				imageView.remove(memo_label);
				imageView.remove(date_label);
				setData(image_index);
			}
		},
		error: function(e) {
			Titanium.UI.createAlertDialog({
				title:'Error saving',
				message:e.error
			}).show();
			navActInd.hide();
			imageView.remove(memo_label);
			imageView.remove(date_label);
			//win.setRightNavButton(null);
		}
	});
	//win.setRightNavButton(null);
});

win.addEventListener('focus', function(e)
{
	Ti.API.debug(win.title + ' focus.');
		
});

win.addEventListener('blur', function(e)
{
	Ti.API.debug(win.title + ' blur.' );
});

win.addEventListener('open', function(e)
{
	Ti.API.debug(win.title + ' open.');
});

win.addEventListener('close', function(e)
{
	Ti.API.debug(win.title + ' close.');
});

/*
organize.addEventListener('click', function()
{
	//Titanium.UI.createAlertDialog({title:'System Button', message:'ORGANIZE'}).show();
	//image save to photogallery.
	
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
*/