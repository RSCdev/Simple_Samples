var win = Ti.UI.createWindow();

alert('Your Database location: '+Ti.Filesystem.applicationSupportDirectory+'/database');

var installDB = Ti.UI.createButton({
    height:30,
    width:100,
    title:'Install',
    top:50
});

var deleteDB = Ti.UI.createButton({
    height:30,
    width:100,
    title:'Delete DB',
    top:100
});

var populateDB = Ti.UI.createButton({
    height:30,
    width:100,
    title:'Populate DB',
    top:150
});

var copyDB = Ti.UI.createButton({
    height:30,
    width:100,
    title:'Copy DB',
    top:200
});

var modifyDB = Ti.UI.createButton({
    height:30,
    width:100,
    title:'Modify DB',
    top:250
});

var showDB = Ti.UI.createButton({
    height:30,
    width:200,
    title:'Show Main DB',
    top:300,
    enabled:false
});

var showBackup = Ti.UI.createButton({
    height:30,
    width:200,
    title:'Show Backup DB',
    top:350,
    enabled:false
});

var revertBackup = Ti.UI.createButton({
    height:30,
    width:200,
    title:'Revert to Backup DB',
    top:400
});

var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationSupportDirectory+'/database','dbTest.sql');

var b = Ti.Filesystem.getFile(Ti.Filesystem.applicationSupportDirectory+'/database','backup.sql');

installDB.addEventListener('click', function(){
    var test = Ti.Database.open('dbTest');

    test.execute("CREATE TABLE cars (id INTEGER PRIMARY KEY, name VARCHAR(16), year INTEGER)");

    Ti.App.Properties.setInt('version', 1);
    
    alert (test.name + ' Installed as version:'+Ti.App.Properties.getInt('version'));
    
    test.close();
});

deleteDB.addEventListener('click', function(){
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationSupportDirectory+'/database','dbTest.sql');

    f.deleteFile();
    b.deleteFile();
    
    if(f.exists()==false && b.exists()==false )
    {
        alert('Database(s) Deleted');
    }
});

populateDB.addEventListener('click', function(){
    var db = Ti.Database.open('dbTest');
    db.execute('INSERT INTO cars (id, name, year ) VALUES(?,?,?)',5,'Mustang', 1966);
    db.execute('INSERT INTO cars (id, name, year ) VALUES(?,?,?)',6,'Beetle',2000);
    db.execute('INSERT INTO cars (id, name, year ) VALUES(?,?,?)',7,'S2000',2001);
    db.execute('INSERT INTO cars (id, name, year ) VALUES(?,?,?)',8,'Ridgeline',2007);
    
    
    var count = db.execute('SELECT * FROM cars');

    alert(count.rowCount+' Records added.');
    
    db.close();
    
    showDB.enabled = true;
    
});


revertBackup.addEventListener('click', function(){
    
    f.deleteFile();
    
    f = Ti.Filesystem.getFile(Ti.Filesystem.applicationSupportDirectory+'/database','dbTest.sql');
    
    f.write(b.read());
    
    Ti.App.Properties.setInt('version', 1);
    
    alert('Database Reverted');
});



modifyDB.addEventListener('click', function(){
    
    
    db = Ti.Database.open('dbTest');
    if (Ti.App.Properties.getInt('version') ==1){
        db.execute("ALTER TABLE cars ADD zip INTEGER DEFAULT '96001'");
        db.execute('INSERT INTO cars (id, name, year ) VALUES(?,?,?)',9,'Test Car',2012);

    Ti.App.Properties.setInt('version', 2);
    }else if(Ti.App.Properties.getInt('version') ==2){
        db.execute("ALTER TABLE cars ADD insure_id INTEGER DEFAULT 1");
        db.execute("CREATE TABLE insurance (id INTEGER PRIMARY KEY, name VARCHAR(16) DEFAULT 'State Farm')");
        db.execute("INSERT INTO insurance (id,name) VALUES (?,?)",1,'AAA');

        Ti.App.Properties.setInt('version', 3);
    }
    alert('Modified DB, now version: '+Ti.App.Properties.getInt('version'));
    db.close();

});

copyDB.addEventListener('click', function(){
    
    b.write(f.read());
    
    alert('Database Copied');
    
    showBackup.enabled = true;
    
});

function showDBTable(data){
    var tableview = Titanium.UI.createTableView();

    db = Ti.Database.open(data);

    rows = db.execute('SELECT * FROM cars');

    if(Ti.App.Properties.getInt('version')==1 || data == 'backup')
        {
            while(rows.isValidRow()){
                carname = rows.field(1);
                year = rows.field(2);
            
                tableview.appendRow(Ti.UI.createTableViewRow({title:carname+', '+year}));

                rows.next();
            }
        }


    else if (Ti.App.Properties.getInt('version')==2)
        {
            while(rows.isValidRow()){
                carname = rows.field(1);
                year = rows.field(2);
                zip = rows.field(3);
            
                tableview.appendRow(Ti.UI.createTableViewRow({title:carname+', '+year+ ', '+zip}));

                rows.next();
            }
        }
    else if (Ti.App.Properties.getInt('version')==3)
        {
            rows2 = db.execute('SELECT cars.insure_id, insurance.id, insurance.name FROM cars, insurance WHERE cars.insure_id = insurance.id');
            while(rows.isValidRow()){
                carname = rows.field(1);
                year = rows.field(2);
                zip = rows.field(3);
                insurance = rows2.fieldByName('name');
            
                tableview.appendRow(Ti.UI.createTableViewRow({title:carname+', '+year+ ', '+zip+', '+insurance}));

                rows.next();
            }
        }
    
    
        
    db.close();

    var modal = Ti.UI.createWindow({
        modal:true
    });

    var back = Ti.UI.createButton({
        title:'Close',
        style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
    });

    back.addEventListener('click', function() {
        modal.close();
    });

    modal.setLeftNavButton(back);

    modal.add(tableview);

    modal.open();
}

showDB.addEventListener('click', function(){

    showDBTable('dbTest');
});

showBackup.addEventListener('click', function(){

    showDBTable('backup');

});





win.add(revertBackup);
win.add(showBackup);
win.add(showDB);
win.add(modifyDB);
win.add(installDB);
win.add(copyDB);
win.add(populateDB);
win.add(deleteDB);

win.open();