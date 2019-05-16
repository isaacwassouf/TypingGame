const electron = require('electron');
const {ipcRenderer}= electron;

ipcRenderer.on("setCount",(e,...args)=>{
     // console.log("YOOHOO Im here!");
     // document.getElementById("numOfWords").innerHTML= args[1];
     // document.getElementById("snd").innerHTML= args[0]+"s";
     let emoji = document.getElementsByTagName("img")[0];
     let txt = document.getElementsByTagName("h2")[0];
     let count  = document.getElementsByTagName("h3")[0];
     if (args[0]){
          emoji.src= "https://img.icons8.com/dusk/100/000000/lol.png";
          txt.innerHTML = "You Finished Typing "+args[2]+" Words In";
          count.innerHTML=args[1]+"s";

     }else{
          emoji.src= "https://img.icons8.com/dusk/100/000000/sad.png";
          txt.innerHTML = "You Only Typed "+args[2]+" Out of "+args[3]+" Words Within";
          count.innerHTML ="60s";
     }

});