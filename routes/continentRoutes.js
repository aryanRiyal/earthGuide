const express = require('express');
const { ContinentsEnum, Continent } = require('./../models/continent');
const { WorldWonder } = require('./../models/wonder');
const { getContinentIdByName } = require('../middleware/getIdByName');

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const data = await Continent.find().populate('wonders');
        console.log("Data Fetched - Successfully");
        res.status(200).json(data);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error - While fetching all Continent Information!!"});
    }
});

//C - Create
router.post('/new', async function(req, res) {
    const data = req.body;
    if(ContinentsEnum.includes(data.name)) {
        try{
            // We can directly pass data to Continent() instead of redundantly changing one by one.
            const newContinent = new Continent(data);
            const savedContinent = await newContinent.save();
            console.log('New Continent Information Saved!');
            res.status(201).json(savedContinent);
        } catch(err) {
            console.error(err);
            res.status(500).json({error: "Internal Server Error - While saving New Continent Information!!"});
        }
    } else {
        res.status(404).json({error: `Continent ${data.name} not found`});
    }
});

//R - Read
router.get('/:name', async (req, res) => {
    const continentName = req.params.name;
    if(ContinentsEnum.includes(continentName)) {
        try{
            const continentDetails = await Continent.findOne({name: continentName}).populate('wonders');
            if(continentDetails) {
                console.log(`Details Fetched for Continent: ${continentName}`);
                res.status(200).json(continentDetails);
            }
            else {
                res.status(404).send({error: `Continent details not found for ${continentName}`});
            }
        } catch (err) {
            console.error(`Error fetching continent details for ${continentName}: `, err);
            res.status(500).send({error : 'Internal Server Error' });
        }
    } else {
        res.status(404).send({error: `Continent ${continentName} not found`});
    }
});

//U - Update
router.put('/:name', getContinentIdByName, async (req, res) => {
    try{
        const continentID = req.continentID;
        const updatedData = req.body;
        const updatedContinent = await Continent.findByIdAndUpdate(continentID, updatedData, {
            new: true,      //Return the updated Document
            runValidators: true     //Run Mongoose Validations
        });
        if(!updatedContinent) {
            return res.status(404).json({error: "Continent not found"});
        }
        console.log(`Information Updated for ${updatedContinent.name}`);
        res.status(200).json(updatedContinent);
    } catch(err) {
        console.error("Error while Updating Info: ", err);
        res.status(500).json({error: "Internal Server error"});
    }
});

//D - Delete
router.delete('/:name',  getContinentIdByName, async (req, res) => {
    try{
        const continentID = req.continentID;
        if(continentID) {
            const deletedContinent = await Continent.findByIdAndDelete(continentID);
            if(!deletedContinent) {
                return res.status(404).json({error: "Continent not found"});
            }
            console.log("Continent Information deleted");
            res.status(200).json({message: "Continent Information deleted Successfully"});
        } else {
            console.error("Error: Continent ID not found");
            res.status(404).json({error: `Continent ID Not found`})
        }
    } catch(err) {
        console.error("Error while Deleting Info: ", err);
        res.status(500).json({error: "Internal Server error"});
    }
});

module.exports = router;