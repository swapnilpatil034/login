const express = require("express");
const User = require("./User")

require('./config');
const app = express();
const jwt = require('jsonwebtoken');
const jkey = 'my-token';

app.use(express.json());
app.post("/register", async (req, resp) => {
    let user = new User(req.body);

    let result = await user.save()
    jwt.sign({ result }, jkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            resp.send({ result: "something went wrong" })
        }
        resp.send({result , auth: token })
    

});  

});

app.post("/login",async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select('-password')
        if (user) {
            jwt.sign({ user }, jkey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send({ result: "something went wrong" })
                }
                resp.send({user, auth: token })
            })

        }
        else {
            resp.send({ result: "no user found" })
        }
    }
    else {
        resp.send({ result: "no user found" })
    }
})
app.listen(9000);