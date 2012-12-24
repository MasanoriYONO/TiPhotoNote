// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#fff');

// create tab group
var tabGroup = Titanium.UI.createTabGroup({
	barColor:'#999'
});


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
	url: 'table_view2.js',
    title:L("menu_text"),
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({
    icon:'KS_nav_views.png',
    title:L("menu_text"),
    window:win1
});

win1.hideTabBar();

tabGroup.addTab(tab1);  

tabGroup.open();