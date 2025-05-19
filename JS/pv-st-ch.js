let PShistory = JSON.parse(localStorage.getItem("history")) || false ;
const pvst = document.querySelector(".privacy-settings-container");
const PvstB = document.querySelector(".iconB");




PvstB.addEventListener('click',()=>{
    if (PShistory) {
        
         PShistory = false;
        localStorage.setItem("history",(JSON.stringify(PShistory)))
  
        PvstB.style.transform = "rotate(180deg)";
        pvst.style.display = "block";
         }
    else if (!PShistory){
        
        PShistory = true;
        localStorage.setItem("history", JSON.stringify(PShistory))
        PvstB.style.transform = "rotate(0deg)";
        pvst.style.display = "none";
    }

    
    
})


if (PShistory) {
    PvstB.style.transform = "rotate(180deg)";
    pvst.style.display = "block"
}
else if (!PShistory) {
    PvstB.style.transform = "rotate(0deg)";
    pvst.style.display = "none"
}

