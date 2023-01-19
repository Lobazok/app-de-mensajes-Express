// se utilizan Express y cors
const express = require("express");
const cors = require("cors");
const { json } = require("express");
const app = express();

app.use(express.json());

let puerto = 3006;
//definimos quienes pueden usar la API
const whitelist = ["http://localhost:5173/"]

app.use(cors())
let active = true
//las peticiones siempre pasan por esta funcion y despues siguen normal(opcional)
app.use((req, res, next) => {
    if (active === true) {
        console.log("Peticion entrante: Ruta:" + req.url + ", Metodo: " + req.method);
        next();
    } else next();
})

let user = [];
let chat = []

app.get("/Users", (req, res) => {
    res.json(user)
})

app.post("/SignUp", (req, res) => {
    console.log(req.body);
    //se verifica la identidad
    let nameUser = req.body.user;
    let passwordUser = req.body.password;
    let index = user.findIndex((u) => u.user === nameUser);

    //si existe ya existe el user
    if (index != -1) {
        if (user[index].password === passwordUser) {
            res.json(user[index]);
            console.log("El usuario: " + user[index].user + " inicio secion");
        } else {
            res.status(404).json(null);
        }
    } else {
        let newUser = { ...req.body, id: user.length + 1 };
        console.log(newUser);
        user.push(newUser);
        res.json(newUser);
    }

});

app.post("/chat/:user", (req, res) => {
    if (req.body) {
        let userQ = req.params.user
        let index = user.findIndex((u) => u.user === userQ);
        if (index != -1) {
            let nameUser = req.body.user.user;
            let passwordUser = req.body.user.password;
            let index = user.findIndex((u) => u.user === nameUser);

            if (user[index].password === passwordUser) {
                let chatE = chat.findIndex((c) => ((c.participante[0] == nameUser || c.participante[0] == userQ) && (c.participante[1] == nameUser || c.participante[1] == userQ)));

                if (chatE != -1) {
                    newMensaje = [req.body.mensaje, nameUser, chat[chatE].mensajes.length];
                    chat[chatE].mensajes.push(newMensaje);
                    res.json(chat[chatE]);
                    console.log(chatE);
                } else {
                    let newChat = {
                        estado: true,
                        participante: [nameUser, userQ],
                        mensajes: []
                    }
                    newMensaje = [req.body.mensaje, nameUser, 0];
                    newChat.mensajes.push(newMensaje);
                    chat.push(newChat);
                    res.json(newChat);
                    console.log(chatE);
                }
            } else {
                res.status(404).json(null);
            }
        } else {
            res.status(401);
        }
    } else {
        res.status(401)
    }

})

app.get("/chat", (req, res) => {
    if (req.body) {
        //se verifica la identidad
        let nameUser = req.body.user;
        let passwordUser = req.body.password;
        let index = user.findIndex((u) => u.user === nameUser);

        if (user[index].password === passwordUser) {
            let jsonData = []
            chat.forEach((c) => {if((c.participante[0] == nameUser || c.participante[1] == nameUser)){ jsonData.push([c.participante, c.mensajes[c.mensajes.length - 1]])}})
            console.log(jsonData);
            res.json(jsonData);
        } else {
            res.status(404).json(null);
        }
    } else {
        res.status(401)
    }


});

app.listen(puerto);
console.log("server in port " + puerto);
