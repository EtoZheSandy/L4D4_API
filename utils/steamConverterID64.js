function convertSteamID64ToSteamID(steamID64) {
    try {
        const steamID64BigInt = BigInt(steamID64);
        const steamID64Base = BigInt(76561197960265728);
        const diff = steamID64BigInt - steamID64Base;
        const Z = diff % BigInt(2);
        const Y = (diff - Z) / BigInt(2);
        const X = 1;

        return `STEAM_${X}:${Z}:${Y}`;
    } catch (error) {
        throw new Error("Invalid SteamID64 format");
    }
}

// Пример использования:
module.exports = {
    convertSteamID64ToSteamID
};
