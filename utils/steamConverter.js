function convertSteamIDToSteamID64(steamID) {
    const parts = steamID.split(":");
    if (parts.length === 3) {
        const [X, Y, Z] = parts.map(Number);
        const steamID64 = BigInt(Z) * BigInt(2) + BigInt(76561197960265728) + BigInt(Y);
        return steamID64.toString();
    } else {
        throw new Error("Invalid SteamID format");
    }
}

// Пример использования:
module.exports = {
    convertSteamIDToSteamID64
};
