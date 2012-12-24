//camera capture from app.js, and make image file local directory.
//This file makes list of image files in local directory.

var win = Ti.UI.currentWindow;

var alert_dialog = Titanium.UI.createAlertDialog({
	title:win.title,
	message:''
});

var data = [];

// create table view
var tableView = Titanium.UI.createTableView({
	data:data
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
	var sql_str = "SELECT DISTINCT(entry_date) AS g_date,count(*) AS rec_cnt FROM t_image GROUP BY entry_date ORDER BY entry_date DESC";
	var rows = db.execute(sql_str);
	while (rows.isValidRow()){
		
		var title_txt = rows.fieldByName('g_date');
		var memo_text = rows.fieldByName('rec_cnt');
		var rec_count = rows.fieldByName('rec_cnt');
		Ti.API.debug(win.title + ' title_txt:' + title_txt +  ' rec_count:' + rec_count);
		
		var t_data = Ti.UI.createTableViewRow({
			layout: 'absolute',
			backgroundColor:'#fff',
			selectedBackgroundColor:'#ddd',
			height:45,
			className:'datarow',
			//clickName:'row',
			clickName:rec_count,
			//hasChild:true,
			color:'#222',
			title:title_txt
		});
		
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
		data.push(t_data);
		rows.next();
	}
	rows.close();
	db.close();
	
	tableView.setData(data);
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
	
	Ti.API.debug('row ' + row + ' index ' + index + 
		' section ' + section  + ' title ' + rowdata.title);
	
	var dateGourpListWindow = Ti.UI.createWindow(
        {
        	url: 'capture_date_detail_list.js',
            title: rowdata.title,
            count:source.clickName,
			backgroundColor: '#fff'
    	}
    );
    Ti.UI.currentTab.open(dateGourpListWindow,{animated:true});
});

// add table view to the window
win.add(tableView);

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
	
	setData();
	
	var s = setInterval(function(){
		Ti.API.debug(win.title + ' win.count :' + win.count);
		Ti.API.debug(win.title + ' timer :' +  data.length);
		if(data.length >= win.count){
			Ti.API.debug(win.title + ' timer stop:' + data.length);
		
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