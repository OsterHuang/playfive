
function formatDate(pDate) {
    return pDate.getFullYear() + '-' + (pDate.getMonth() + 1) + '-' + pDate.getDate();
}

function formatTime(pDate) {
    return pDate.getHours() + ':' + pDate.getMinutes();
    //return pDate.getFullYear() + '-' + (pDate.getMonth() + 1) + '-' + pDate.getDate();
}