//camera capture from app.js
//カメラを起動して写真撮影。そのあとファイルまたはDBへデータ保存。コメントを追加するためのボタンを画面上部に配置。
//できればコメントはtwitterのメッセージ入力画面のようにモーダルビューにしてすっきりさせたい。
//表示する撮影画像は拡大縮小ができて、スクロール可能に。
//この画面は撮影直後だけでなく、フォトギャラリーから選択したときにも使いたい。

var win = Ti.UI.currentWindow;

var alert_dialog = Titanium.UI.createAlertDialog({
	title:win.title,
	message:''
});


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
    	//image:'http://www.appcelerator.com/wp-content/uploads/2009/06/titanium_desk.png',
        width: 'auto',
        height: 'auto',
        top:0,
 		left:0
    }
);
//imageView.hide();


var actInd = Titanium.UI.createActivityIndicator({
	bottom:10, 
	height:50,
	width:10,
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
});



function zero_pad(v){
	var rel = "00" + v;
	return rel.slice(-2);
}

function startCamera() {
	win.toolbar = [];
	//imageView.hide();
    // imageView.image = null;
	var cap_image = null;
            	
    Titanium.Media.showCamera(
        {
            success:function(event) {
            	
            	
            	// actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
				// actInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
				// actInd.color = 'white';
				// actInd.message = 'Loading...';
				// actInd.width = 210;
				// actInd.show();
				
				// win.add(actInd);
				
                cap_image = event.media;
                
                //これは返ってこない。
                //var thumbnail_image = event.thumbnail;

 				//save to database.
 				var date = new Date();
        		Ti.API.debug('getFullYear:' + date.getFullYear() 
        			+ ' getMonth:' + zero_pad(date.getMonth()+1)
        			+ ' getDate:' + zero_pad(date.getDate())
        			+ ' getHours:' + zero_pad(date.getHours())
        			+ ' getMinutes:' + zero_pad(date.getMinutes())
        			+ ' getSeconds:' + zero_pad(date.getSeconds()) 
        			);
        		var reg_date = date.getFullYear() + '-' + 
        				zero_pad(date.getMonth()+1) + '-' +
        				zero_pad(date.getDate());
        		
        		var reg_time = zero_pad(date.getHours()) + ':' + 
        				zero_pad(date.getMinutes()) + ':' +
        				zero_pad(date.getSeconds());
        		
        		var reg_date_time = date.getFullYear() + 
        				zero_pad(date.getMonth()+1) + 
        				zero_pad(date.getDate()) + 
        				zero_pad(date.getHours()) + 
        				zero_pad(date.getMinutes()) + 
        				zero_pad(date.getSeconds());
        		
        		
        		
        		imageView.image = cap_image;
        		
        		if(imageView.size.width < imageView.size.height){
					scrollView.zoomScale = 0.267;
				}else{
					scrollView.zoomScale = 0.2;
				}
        		//imageView.show();
        		
        		//save to file.
                var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,reg_date_time + '.jpg');
				f.write(cap_image);

				//imageViewのloadしたタイミングでeventlistenerの処理に行ったきり戻ってこなかった。
				//戻るにもイベントをfireしないといけないらしい。
				
				//写真の横向き対応

 				if(imageView.size.width < imageView.size.height){
 					scrollView.zoomScale = 0.267;
					var thumb_image = cap_image.imageAsResized(75,100);
				}else{
					scrollView.zoomScale = 0.2;
					var thumb_image = cap_image.imageAsResized(100,75);
				}
	
 				var thumbnail_file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,reg_date_time + '.png');
				thumbnail_file.write(thumb_image);
  				
  				var db = Ti.Database.open('image.db');
				db.execute('INSERT INTO t_image (filename,entry_date,entry_time) VALUES(?,?,?)'
					,reg_date_time + '.jpg',reg_date,reg_time);
				
				db.close();
				
				actInd.message = null;
				actInd.hide();
				win.toolbar = [compose];
				
				thumb_image = null;
						
            },
            //cancel:function(){},
            error:function(error) {
                // if (error.code == Titanium.Media.NO_CAMERA)
                // {
                    // alert('no camera.');
                // }
                var a = Titanium.UI.createAlertDialog({title:'Camera'});
				if (error.code == Titanium.Media.NO_CAMERA)
				{
					a.setMessage('Please run this test on device');
				}
				else
				{
					a.setMessage('Unexpected error: ' + error.code);
				}
				a.show();
            },
            saveToPhotoGallery:false,
            allowEditing:false,
            
            
            mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
        }
    );
}

/*
function selectFromPhotoGallery() {
    Ti.Media.openPhotoGallery(
        {
            success: function(event) {
                var image = event.media;
                imageView.image = image;
                imageView.show();
                uploadToTwitPic(image);
             },
            // error:  function(error) { },
            // cancel: function() { },
            allowEditing: false,
            mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
        }
    );
}

var sourceSelect = Titanium.UI.createOptionDialog({
    options:['撮影する', 'アルバムから選ぶ', 'キャンセル'],
    cancel:2,
    title:'写真を添付'
});

sourceSelect.addEventListener('click',function(e)
{
    switch( e.index ) {
    case 0:
        startCamera();
        break;
    case 1:
        selectFromPhotoGallery();
        break;
    }
});

var photoButton = Ti.UI.createButton(
    {
        top: 10,
        left: 10,
        width: 80,
        height: 44,
        title: 'photo'
    }
);

photoButton.addEventListener(
    'click',
    function() {
        sourceSelect.show();
    }
);
win.add(photoButton);
*/

var bb = Titanium.UI.createButton({
	/*
	labels:['撮影する', 'アルバムから選ぶ'],
	backgroundColor:'#336699',
	top:50,
	style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	height:25,
	width:200
	*/
	systemButton:Titanium.UI.iPhone.SystemButton.CAMERA
});

bb.addEventListener('click',function(e)
{
/*
	switch( e.index ) {
    case 0:
        startCamera();
        break;
    case 1:
        selectFromPhotoGallery();
        break;
    }
*/
	startCamera();
});

var compose = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.COMPOSE
});


compose.addEventListener('click', function()
{
	var db = Ti.Database.open('image.db');
	var rows = db.execute('SELECT max(id) AS maxid FROM t_image');
	while (rows.isValidRow()){
		var image_id = rows.fieldByName('maxid');
		rows.next();
	}
	rows.close();
	db.close();

	var messageWindow = Ti.UI.createWindow(
        {
            url: 'message_window.js',
            title: L("memo_title_text"),
            image_id:image_id,
			backgroundColor: '#fff'
        }
    );
    Ti.UI.currentTab.open(messageWindow,{animated:true});
});

win.addEventListener('focus', function(e)
{
	Ti.API.debug(win.title + ' focus.');
	//Ti.API.debug(win.title + ' focus. imageView:' + typeof(imageView));
	//if(typeof(imageView) !== 'undefined'){
	//imageView.hide();
	//}
	Ti.API.debug(win.title + ' focus. imageView:' + typeof(imageView));
});

win.addEventListener('blur', function(e)
{
	Ti.API.debug(win.title + ' blur.' );
	//scrollView.remove(imageView);
	//win.toolbar = [];
});

win.addEventListener('open', function(e)
{
	Ti.API.debug(win.title + ' open.');
	//imageView.hide();
	scrollView.add(imageView);
	win.add(scrollView);
	
	win.setRightNavButton(bb);
	
	startCamera();
	//win.toolbar = [compose];
});

win.addEventListener('close', function(e)
{
	Ti.API.debug(win.title + ' close.');
});