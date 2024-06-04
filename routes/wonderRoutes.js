const express = require('express');
const {WorldWonderEnum, WorldWonder} = require('./../models/wonder');
const { ContinentsEnum, Continent } = require('../models/continent');
const { getWonderIdByName } = require('../middleware/getIdByName');

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const data = await WorldWonder.find().populate('continent');
        // const data = await WorldWonder.find();
        console.log("Data Fetched - Successfully");
        res.status(200).json(data);
    } catch (err) {
        console.error("Error while fetching Info: ", err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

//C-Create
router.post('/new', async (req, res) => {
    const data = req.body;
    if(WorldWonderEnum.includes(data.name) && ContinentsEnum.includes(data.continent)) {
        try{
            const continentDetails = await Continent.findOne({ name: data.continent });
            if(!continentDetails) {
                return res.status(404).json({ error: `Continent ${data.continent} not found` });
            }
            const continentID = continentDetails._id;
            const newWonder = new WorldWonder({
                ...data,
                continent: continentID
            });
            const savedWonder = await newWonder.save();
            await Continent.findByIdAndUpdate( continentID, {
                $push: {wonders: savedWonder._id}
            });
            console.log('New Wonder Information Saved!');
            res.status(201).json(savedWonder);
        } catch(err) {
            console.error("Error while saving new Wonder Info: ", err);
            res.status(500).json({error: "Internal Server Error"});
        }
    } else {
        res.status(400).json({error: "Bad Request"});
    }
});

//R-Read
router.get('/:name', async (req, res) => {
    const wonderName = req.params.name;
    if(WorldWonderEnum.includes(wonderName)) {
        try{
            const wonderDetails = await WorldWonder.findOne({name: wonderName}).populate('continent');
            if(wonderDetails) {
                console.log(`Details Fetched for Wonder: ${wonderName}`);
                res.status(200).json(wonderDetails);
            } else {
                res.status(404).json({error: `Wonder details not found for ${wonderName}`});
            }
        } catch(err) {
            console.error(`Error fetching wonder details for ${wonderName}: `, err);
            res.status(500).json({error : 'Internal Server Error' });
        }
    } else {
        res.status(404).json({error: `Wonder ${wonderName} not found`});
    }
});

//U-Update
router.put('/:name', getWonderIdByName, async (req, res) => {
    try{
        const wonderID = req.wonderID;
        const updatedData = req.body;
        const updatedWonder = await WorldWonder.findByIdAndUpdate(wonderID, updatedData, {
            new: true,
            runValidators: true
        });
        if(!updatedWonder) {
            return res.status(404).json({error: "Wonder not found"});
        }
        console.log(`Information Updated for ${updatedWonder.name}`);
        res.status(200).json(updatedWonder);
    } catch(err) {
        console.error("Error while Updating Info: ", err);
        res.status(500).json({error: "Internal Server error"});
    }
});

//D-Delete
router.delete('/:name',  getWonderIdByName, async (req, res) => {
    try{
        const wonderID = req.wonderID;
        if(wonderID) {
            const deletedWonder = await WorldWonder.findByIdAndDelete(wonderID);
            if(!deletedWonder) {
                return res.status(404).json({error: "Wonder not found"});
            }
            console.log("Wonder Information deleted");
            res.status(200).json({message: "Wonder Information deleted Successfully"});
        } else {
            console.error("Error: Wonder ID not found");
            res.status(404).json({error: `Wonder ID Not found`})
        }
    } catch(err) {
        console.error("Error while Deleting Info: ", err);
        res.status(500).json({error: "Internal Server error"});
    }
});

module.exports = router;