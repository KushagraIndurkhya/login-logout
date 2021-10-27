const express = require('express');
const router = express.Router();
const User = require('../models/user');
router.get('/', (req, res) => {
    session = req.session;
    if (session.email) {
        res.send("Welcome " + session.email + " <a href = \'/logout' > click to logout </a>");
    } else
        res.sendFile('views/index.html', { root: __dirname })
});


router.get('/login', function(req, res) {
    if (session.email) {
        res.send("You Are already Logged in");
    }

    User.findOne({ email: req.query.email }, function(err, user) {
        if (user === null) {
            return res.status(400).send({
                message: "User not found."
            });
        } else {
            if (user.validPassword(req.query.password)) {
                req.session.email = user.email;
                req.session.username = user.name;
                req.session.save(err => {
                    if (err) {
                        console.log(err);
                    }
                });
                res.redirect('/');
            } else {
                return res.status(400).send({
                    message: "Wrong Password"
                });
            }
        }
    });


});


router.post('/signup', function(req, res) {
    let newUser = new User();
    newUser.setInfo(req.body.username, req.body.email);
    newUser.setPassword(req.body.password);
    newUser.save((err, User) => {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: "Failed to add user."
            });
        } else {
            return res.status(201).send(
                "User added login <a href=\'/'>here</a>"
            );
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;