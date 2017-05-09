
//require dependencies
const User = require('../models/User'),
      Group = require('../models/Group'),
      path = require('path'),
      usersData = require('../data/seedData.json').users;

//export controller
module.exports = {
    getAll: getAll,
    createSingle: createSingle,
    getSingle: getSingle,
    putSingle: putSingle,
    deleteSingle: deleteSingle,
    seedAll: seedAll,
};

function getAll(req, res) {
    //get all users
    User.find({}, (err, users) => {
        if (err || users.length === 0) {
            return res.status(404).json({ message: 'Users not found!' });
        }

        //send response
        res.status(200).json(users);
    });
}

function getSingle(req, res) {
    //get single user
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        //send response
        res.status(200).json(user);
    });
}

function createSingle(req, res) {
    // create a new user ===============================
    const user = new User({
        name: req.body.name,
        email: req.body.email
    });

    // save user
    user.save((err) => {
        if (err)
            return res.status(500).json({ message: "Can't save user!", error: err.message });

        //send response
        res.status(201).json(user);
    });
}

function putSingle(req, res) {
    //update single
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, user) => {
       if (err || !user) {
           return res.status(404).json({ message: "User not found!"});
       }

        //send response
        res.status(200).json(user);
    });
}

function seedAll(req, res) {
    User.remove({}, () => {
        for (user of usersData) {
            var newUser = new User(user);
            newUser.save();
        }
    });

    res.json({ message: 'Database seeded with users!' });
}

function deleteSingle(req, res) {
    User.remove({ _id: req.params.id }, () => {
        //res.status(200).json({ message: "User deleted!" });
        res.status(204).send();
    });
}
