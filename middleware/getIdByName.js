const {ContinentsEnum, Continent} = require('./../models/continent');
const {WorldWonderEnum, WorldWonder} = require('./../models/wonder');

async function getContinentIdByName(req, res, next) {
    const continentName = req.params.name.trim();
    if (!ContinentsEnum.includes(continentName)) {
        return res.status(404).json({ error: `Continent ${continentName} not found` });
    }
    try {
        const continentDetails = await Continent.findOne({ name: continentName });
        if (continentDetails) {
            req.continentID = continentDetails._id;
            return next();
        } else {
            return res.status(404).json({ error: `Continent details not found for ${continentName}` });
        }
    } catch (err) {
        console.error(`Error fetching continent details for ${continentName}: `, err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

async function getWonderIdByName(req, res, next) {
    const wonderName = req.params.name.trim();
    if (!WorldWonderEnum.includes(wonderName)) {
        return res.status(404).json({ error: `Wonder ${wonderName} not found` });
    }
    try {
        const wonderDetails = await WorldWonder.findOne({ name: wonderName });
        if (wonderDetails) {
            req.wonderID = wonderDetails._id;
            req.continentID = wonderDetails.continentInfo;
            return next();
        } else {
            return res.status(404).json({ error: `Wonder details not found for ${wonderName}` });
        }
    } catch (err) {
        console.error(`Error fetching wonder details for ${wonderName}: `, err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// async function getWonderIdByName(req, res, next) {
//     const wonderName = req.params.name.trim();
//     if (!WorldWonderEnum.includes(wonderName)) {
//         return res.status(404).json({ error: `Wonder ${wonderName} not found` });
//     }
//     try {
//         const wonderDetails = await WorldWonder.findOne({ name: wonderName });
//         if (wonderDetails) {
//             req.wonderID = wonderDetails._id;
//             next();
//         } else {
//             res.status(404).json({ error: `Wonder details not found for ${wonderName}` });
//         }
//     } catch (err) {
//         console.error(`Error fetching Wonder details for ${wonderName}: `, err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
//     } else {
//         res.status(404).json({ error: `Wonder ${wonderName} not found` });
//     }
// };
module.exports = {getContinentIdByName, getWonderIdByName};