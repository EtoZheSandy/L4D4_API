// Функция для валидации SteamID
function isValidSteamID(steamID) {
    const steamIDPattern = /^STEAM_[0-5]:[01]:\d{1,15}$/;
    return steamIDPattern.test(steamID);
}

module.exports = {
    isValidSteamID
};
