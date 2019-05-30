const electron = require('electron');

const {app,BrowserWindow,globalShortcut,Menu,MenuItem,ipcMain}= electron;

let mainWin;
let finishWin; 

process.env.NODE_ENV= "production";

app.on("ready", ()=>{
    mainWin = new BrowserWindow({width: 1000,height:617});    
    mainWin.loadFile('index.html');

    ipcMain.on("stopWin",(e,...args)=>{
        finishWin= new BrowserWindow({width:750,height: 370, resizable: false});

        if(!args[0])
           finishWin.setSize(920,370);
            
        finishWin.loadFile("finish.html");
        finishWin.setMenu(null);

        finishWin.webContents.on("dom-ready",()=>{
            finishWin.webContents.send("setCount",args[0],args[1],args[2],args[3]);
        });
    });
    
    mainWin.on("close",()=>{

        try{
            if (finishWin != null){
                finishWin.close();
            }
        }catch(err){
            console.log(err.msg);
        }

    });

    const menu = Menu.buildFromTemplate(template);    
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', app.quit);
app.on('before-quit', () => {
    mainWin.removeAllListeners('close');
})



const template= [
    {
        label: "File",
        submenu: [
            {
                label: "New Game",
                accelerator: "CommandOrControl+N",
                click: ()=>{
                    mainWin.webContents.send("start","start");
                    try{
                        if (finishWin != null){
                            finishWin.close();
                        }
                    }catch(err){
                        console.log(err.msg);
                    }
                }
            },

            {
                label: "Stop Game",
                accelerator: "CommandOrControl+S",
                click: ()=>{mainWin.webContents.send("stop","stop");}
            },

            {role: "quit"}
        ]
    },

    {
        label: "Edit",
        submenu: [
            { role: 'cut' },
            { role: "copy" },
            { role: "paste" },
            { role: 'delete' },
            { role: 'toggledevtools' }
        ]
    },

    {
        label: 'View',
        submenu: [
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
];





