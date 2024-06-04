const {ContinentsEnum, Continent} = require('./../models/continent');
const {WorldWonderEnum, WorldWonder} = require('./../models/wonder');

async function getContinentIdByName(req, res, next) {
    const continentName = req.params.name;
    if (ContinentsEnum.includes(continentName)) {
        try {
            const continentDetails = await Continent.findOne({ name: continentName });
            if (continentDetails) {
                req.continentID = continentDetails._id;
                next();
            } else {
                res.status(404).json({ error: `Continent details not found for ${continentName}` });
            }
        } catch (err) {
            console.error(`Error fetching continent details for ${continentName}: `, err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(404).json({ error: `Continent ${continentName} not found` });
    }
};

async function getWonderIdByName(req, res, next) {
    const wonderName = req.params.name;
    if (WorldWonderEnum.includes(wonderName)) {
        try {
            const wonderDetails = await WorldWonder.findOne({ name: wonderName });
            if (wonderDetails) {
                req.wonderID = wonderDetails._id;
                next();
            } else {
                res.status(404).json({ error: `Wonder details not found for ${wonderName}` });
            }
        } catch (err) {
            console.error(`Error fetching Wonder details for ${wonderName}: `, err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(404).json({ error: `Wonder ${wonderName} not found` });
    }
};

module.exports = {getContinentIdByName, getWonderIdByName};