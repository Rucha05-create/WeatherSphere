let dark=true;

themeBtn.addEventListener("click",()=>{

    if(dark){

        document.body.style.background=
        "linear-gradient(135deg,#edf2fb,#ffffff,#d8f3dc)";

        document.body.style.color="#222";

        themeBtn.innerHTML="☀";

    }

    else{

        document.body.style.background=
        "linear-gradient(135deg,#1e3c72,#2a5298,#6dd5ed,#2193b0)";

        document.body.style.color="white";

        themeBtn.innerHTML="🌙";

    }

    dark=!dark;

});