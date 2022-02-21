const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken")
const JWTSecret = "sdffgffg"

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function auth(req,res,next){
    const authToken = req.headers['authorization'];
    if(authToken == undefined) {
        res.status(401);
        res.json({err: "Token Invalido"});
    } else {
        const token = authToken.split(' ')[1]
        jwt.verify(token, JWTSecret, (err, data) => {
            if(err) {
                res.status(401)
                res.json({err:"Token Inválido"})
            } else {
                req.token = token
                req.loggedUser = {id: data.id, email: data.email}
                next();
            }
        })
    }
    
}


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
    ],
    users: [
        {
            id: 1,
            name: "Joao",
            email:"joaobuzato.dev@gmail.com",
            password:"nodeEstudo"
        },
        {
            id: 2,
            name: "Pedro",
            email:"pedrobuzato.dev@gmail.com",
            password:"nodeEstudo"
        }
    ]
}


app.get("/games", auth, (req,res) =>{

    
    res.statusCode = 200;
    res.json(DB.games);
});

app.get("/games/:id", auth, (req,res) =>{
    var id = req.params.id;
    var HATEOAS = [
        {
            href: "http://localhost:8080/game/"+id,
            method: "DELETE",
            rel: "delete_game"
        },
        {
            href: "http://localhost:8080/game/"+id,
            method: "PUT",
            rel: "edit_game"
        },

    ]
    if(isNaN(id)){
        res.sendStatus(400);
    } else {
        id = parseInt(id)
        var game = DB.games.find(g => g.id == id);
        if(game == undefined){
            res.sendStatus(404);
        }   else {
            res.status = 200;
            res.json({game, _links: HATEOAS});
        }
        
    }
});

app.post("/games", auth, (req,res) => {
    var { title, price, year } = req.body;
    DB.games.push({
        id: 2345,
        title,
        price,
        year
    });
    res.sendStatus(201);
});

app.delete("/games/:id",auth, (req,res) => {
    var id = req.params.id;
    var HATEOAS = [
        {
            href: "http://localhost:8080/game/"+id,
            method: "GET",
            rel: "get_game"
        },
        {
            href: "http://localhost:8080/game/"+id,
            method: "PUT",
            rel: "edit_game"
        },

    ]
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

app.put("/games/:id",auth, (req,res) => {
    var id = req.params.id;
    var HATEOAS = [
        {
            href: "http://localhost:8080/game/"+id,
            method: "DELETE",
            rel: "delete_game"
        },
        {
            href: "http://localhost:8080/game/"+id,
            method: "GET",
            rel: "get_game"
        },

    ]
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
            res.json({game, _links:HATEOAS});
        }
        
    }
});

app.post("/auth", (req,res)=>{
    var {email, password} = req.body;

    

    if(email == undefined){
        res.status(400);
        res.json({err: "Email inválido"})
    } else {
        var user = DB.users.find(u => u.email == email)
        if (user == undefined){
            res.status(404)
            res.json({err: "O e-mail não existe na base"})
        } else {
            if(user.password != password){
                res.status(401)
                res.json("Não autorizado.")
            } else {
                jwt.sign({id: user.id, email:user.email}, JWTSecret, {expiresIn:'1h'}, (err, token) => {
                    if(err){
                        res.status(400);
                        res.json({err: "Falha interna"})
                    } else {
                        res.status(200);
                        res.json({token: token});
                    }
                })
            }
        }
    }
})


app.listen(8080, () => {
    console.log("API Up!");
})