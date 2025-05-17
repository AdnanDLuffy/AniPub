const profile = document.querySelector(".profile-icon");

profile.addEventListener('click',()=>{
    if(profile.dataset.account === "guest") {
        window.location.href = "/Login"
        // I will add a modal later ! 
    }
    else {
        window.location.href = `/Profile/${profile.dataset.account}`;
    }
})