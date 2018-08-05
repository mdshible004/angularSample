
function generateSecurityToken(instId, loggedUser, menuId, actionType) {
    var model = {
        instituteId: instId,
        userId: loggedUser,
        menuId: menuId,
        key: actionType,
        userAgent: 'Chrome/Mozzila'  //jshint ignore : line
    };

    var message = [model.userId, model.userAgent].join(':');
    var hash = CryptoJS.HmacSHA256(message, model.key); //jshint ignore : line
    var token = CryptoJS.enc.Base64.stringify(hash); //jshint ignore : line

    var tokenId = [model.instituteId, model.userId, model.menuId, model.key].join(':');
    var tokenGenerated = CryptoJS.enc.Utf8.parse([token, tokenId].join(':')); //jshint ignore : line

    return CryptoJS.enc.Base64.stringify(tokenGenerated); //jshint ignore : line
}
