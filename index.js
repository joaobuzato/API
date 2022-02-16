const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



var DB = {
    games: [
        {
            id: 23,
            title:"Dark Souls",
            year: 2011,
            price: 40
        },
        {
            id: 24,
            title:"Metal Gear Solid",
            year: 1998,
            price: 14
        },
        {
            id: 25,
            title:"Fallout: New Vegas",
            year: 2010,
            price: 10
        }
    ]
}


app.get("/games", (req,res) =>{
    res.statusCode = 200;
    res.json(DB.games);
});

app.get("/games/:id", (req,res) =>{
    var id = req.params.id;
    if(isNaN(id)){
        res.sendStatus(400);
    } else {
        id = parseInt(id)
        var game = DB.games.find(g => g.id == id);
        if(game == undefined){
            res.sendStatus(404);
        }   else {
            res.status = 200;
            res.json(game);
        }
        
    }
});

app.post("/games", (req,res) => {
    var { title, price, year } = req.body;
    DB.games.push({
        id: 2345,
        title,
        price,
        year
    });
    res.sendStatus(201);
});

app.delete("/games/:id", (req,res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.sendStatus(400);
    } else {
        id = parseInt(id)
        var index = DB.games.findIndex(g => g.id == id);
        console.log(index);
        if(index == -1){
            res.sendStatus(404);
        }   else {
            res.status = 200;
            DB.games.splice(index,1);
        }
        
    }
});

app.put("/games/:id", (req,res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.sendStatus(400);
    } else {
        id = parseInt(id)
        var game = DB.games.find(g => g.id == id);
        if(game == undefined){
            res.sendStatus(404);
        }   else {
            var { title, price, year } = req.body;
            if(title != undefined){
                game.title = title;
            }
            if(year != undefined){
                game.year = year;
            }
            if(price != undefined){
                game.price = price;
            }
            res.status = 200;
            res.json(game);
        }
        
    }
});


app.listen(8080, () => {
    console.log("API Up!");
})