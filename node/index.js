var Steam = require('steam'),
    steamClient = new Steam.SteamClient(),
    steamUser = new Steam.SteamUser(steamClient),
    steamGC = new Steam.SteamGameCoordinator(steamClient, 730),
    csgo = require('csgo'),
    CSGO = new csgo.CSGOClient(steamUser, steamGC, false),
    CSGOCli = new csgo.CSGOClient(steamUser, steamGC, true);


    const matchCode = "CSGO-3rxQ6-S6Xec-sfFnb-Yzfo9-6xEOP";

function getDemoLink(matchCode) {
    //decode matchCode into matchID, outcomeId, and tokenId
    var scDecoder = new csgo.SharecodeDecoder(matchCode);
    console.log(`Sharecode ${matchCode} decodes into: `);
    let decodedMatch = scDecoder.decode();
    console.log(decodedMatch);

    //get the demo link
    CSGOCli.requestGame(decodedMatch.matchId, decodedMatch.outcomeId, decodedMatch.tokenId);
    CSGOCli.on("matchList", function () {
        console.log("Match list received.");
    });
}

getDemoLink(matchCode);