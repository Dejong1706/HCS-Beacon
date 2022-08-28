const getDate = (date) => {
    var alertYear = date.getFullYear();
    var alertMonth = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    var alertDay = ('0' + date.getUTCDate()).slice(-2);

    return alertYear + '.' + alertMonth + '.' + alertDay;
}

const getTime = (date) => {

    var hours = ('0' + date.getUTCHours()).slice(-2); 
    var minutes = ('0' + date.getUTCMinutes()).slice(-2);
    return hours + ':' + minutes;
}

module.exports = {
    getDate,
    getTime
}