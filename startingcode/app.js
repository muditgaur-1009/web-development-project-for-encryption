require('dotenv').config()


const express = require("express")
const bodyparser = require("body-parser")
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
const encrypt=require("mongoose-encryption")


const app = express();

app.set('views', __dirname + '/views')
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(express.static("public"));



app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true })


const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});



UserSchema.plugin(encrypt,{secret : process.env.SECRET,encyrptedFields:["password"]});

const User = new mongoose.model("user", UserSchema)

app.get("/", function (req, res) {
    res.render("home");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("secrets")
        }
    })
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err)
        }
        else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets.ejs");
                }
            }
        }
    })
});

app.listen(3000, function () {
    console.log("server is running on port 3000");
})
