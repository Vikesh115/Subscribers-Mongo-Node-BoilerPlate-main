const express = require("express");
const app = express();
const path = require("path");
const Subs = require("./models/subscribers");
const data = require("./data");
// Your code goes here

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

// post subscribers to database
app.post("/add", async (req, res) => {
    try {
        await Subs.deleteMany(); // Delete previous data from database 
        const output = await Subs.insertMany(data); // insert data to database
        console.log(output);
        res.status(200).json(output);
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
});

// GET all subscribers present in databse
app.get("/subscribers", async (req, res) => {
    try {
        const data = await Subs.find(); // Used find() method to find details of all subscribers
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET subscribers by name
app.get("/subscribers/name", async (req, res) => {
    try {
        const data = await Subs.find({}, { _id: 0, name: 1, subscribedChannel: 1 }); // find all subscribers with name and subscribedChannel
        res.status(200).json(data); 
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET subscribers by id 
app.get("/subscribers/:id", async (req,res)=>{
    try {
        const data = await Subs.findById(req.params.id) // find data by given id
        if (!data) {
            res.status(404).json({message:"Data not found."})
        }else{
            res.status(200).json(data)
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = app;
