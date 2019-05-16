
var countProcess;
var checkprocess;
var alreadyRunning= false;

var completeQ=[];
var words = document.getElementById("firstTxtArea").value.split(" ");


(function startGame(){
    alreadyRunning= true;
    createCounter();
    checkSpelling();
})();

function stopGame(){
    stopCounter();
    stopCheckSpelling();
    alreadyRunning = false;
}

function createCounter(){
    
    const counter= document.getElementById("counter");
    counter.innerHTML = 60;
    let current= 60;

    countProcess = setInterval(()=>{
        if(current == 0){
            stopGame();
            /*
            Does not make sense but trust me it does..
            You see this condition exists to prevent a race condition
            that could happen if the user finishes in the last second '0'
            thus preventing sending two messages to the main process.
            */
            let orgTxt = document.getElementById("firstTxtArea").value;
            let inputTxt = document.getElementById("secondTxtArea");

            if (orgTxt != inputTxt){
                let counterValue= document.getElementById("counter").innerHTML;
                let numOfWordsTyped= document.getElementById("secondTxtArea").value.split(" ").filter((word)=>{
                    return word != "";
                }).length;
                ipcRenderer.send("stopWin",false,counterValue,numOfWordsTyped, orgTxt.split(" ").length);
            }

            
        }else{
            current=current-1;
            counter.innerHTML=current;
        }   
    },1000);
}


function stopCounter(){
    clearInterval(countProcess);
}


function checkSpelling(){
    /*
    *  initialize the textArea
    */
    let txtInput= document.getElementById("secondTxtArea");
    txtInput.readOnly = false;
    txtInput.value= "";

    let current;
    let currentLength;
    const orgText = document.getElementById("firstTxtArea").value;
    const originalLength = orgText.length;
    
    checkprocess = setInterval(()=>{
        current = txtInput.value;
        currentLength = current.length;
        

        if (current == orgText.substr(0,currentLength)){
            if (currentLength == originalLength){
                // Win
                stopGame();
                let counterValue= document.getElementById("counter").innerHTML;
                let numOfWordsTyped= txtInput.value.split(" ").length;
                ipcRenderer.send("stopWin",true,counterValue,numOfWordsTyped,null);
                
            }

           txtInput.style.color = "#000";
        }else{
            txtInput.style.color= "#b71c1c";
        }
    },200);    
}

function stopCheckSpelling(){
    clearInterval(checkprocess);
    document.getElementById("secondTxtArea").readOnly = true;
}

function newTurn(){
    if (!alreadyRunning){
        alreadyRunning= true;
        createCounter();
        checkSpelling();
    }
}


const electron = require("electron");
const {ipcRenderer}= electron;

ipcRenderer.on("stop",(e,msg)=>{
    stopGame();
});

ipcRenderer.on("start",(e,msg)=>{
    console.log(alreadyRunning);
    newTurn();
    console.log(alreadyRunning);
});


