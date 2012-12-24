var win = Ti.UI.currentWindow;

var alert_dialog = Titanium.UI.createAlertDialog({
	title:win.title,
	message:''
});

/*
Titanium.Media.openPhotoGallery({
    allowEditing:true,

    success: function(event)
    {
*/
	var emailDialog = Titanium.UI.createEmailDialog();
	Ti.API.debug(win.title + ' action:');
    if (!emailDialog.isSupported()) {
    	Ti.API.debug(win.title + ' action:Email not available.');
    	
        alert_dialog.message = 'Email not available';
		alert_dialog.show();
        return;
    }
    
    emailDialog.setSubject(win.title);
    emailDialog.setToRecipients(['myono.c50@gmail.com']);
    //emailDialog.setCcRecipients(['bar@yahoo.com']);
    //emailDialog.setBccRecipients(['blah@yahoo.com']);
		
    if (Ti.Platform.name == 'iPhone OS') {
        emailDialog.setMessageBody('<b>' + win.title + '</b>');
        emailDialog.setHtml(true);
        emailDialog.setBarColor('#336699');
    } else {
        emailDialog.setMessageBody(win.title);
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

                alert_dialog.message = 'message was sent';
				alert_dialog.show();
            }
        }else{
        	
            alert("message was not sent. result = " + e.result);
        }
    });
    
    emailDialog.open();
/*
    },

    error: function(error)
    {

    },

    cancel: function()
    {

    }
});
*/