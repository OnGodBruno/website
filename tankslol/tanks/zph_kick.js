let closer = setTimeout(closeW,60000);

function check_afk_reset(){
    clearTimeout(closer);
    closer = setTimeout(closeW,60000);
}


function closeW(){
    location.reload();
}