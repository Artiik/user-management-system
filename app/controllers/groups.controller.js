
//require dependencies
const User = require('../models/User'),
      Group = require('../models/Group'),
      path = require('path'),
      groupData = require('../data/seedData.json').groups;

//export controller
module.exports = {
    getAll: getAll,
    createSingle: createSingle,
    getSingle: getSingle,
    putSingle: putSingle,
    deleteSingle: deleteSingle,
    seedAll: seedAll,
    addUserToGroup: addUserToGroup,
    deleteUserFromGroup: deleteUserFromGroup
};

function getAll(req, res) {
    //get all
    Group.find({}, (err, group) => {
        if (err || !group) {
            return res.status(404).json({ message: 'Groups not found!' });
        }

        //send response
        res.status(200).json(group);
    });
}

function getSingle(req, res) {
    //get single
    Group.findOne({ _id: req.params.id }, (err, group) => {
        if (err || !group) {
            return res.status(404).json({ message: 'Group not found!' });
        }

        //send response
        res.status(200).json(group);
    });
}

function createSingle(req, res) {
    // create a new event ===============================
    const group = new Group({
        name: req.body.name,
    });

    // save event
    group.save((err) => {
        if (err)
            return res.status(500).json({ message: "Can't save group!", error: err.message });

        //send response
        res.status(201).json(group);
    });
}

function putSingle(req, res) {
    //update single
    Group.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, group) => {
        if (err || !group) {
            return res.status(404).json({ message: "Group not found!"});
        }

        //send response
        res.status(201).json(group);
    });
}

function seedAll(req, res) {
    Group.remove({}, () => {
        for (group of groupData) {
            var newGroup = new Group(group);
            newGroup.save();
        }
    });

    res.json({ message: 'Database seeded with groups!' });
}

function deleteSingle(req, res) {
    Group.findOne({ _id: req.params.id })
        .populate('users')
        .exec((err, group) => {
           if (group.users.length === 0) {
               group.remove((err) => {
                   res.status(200).json({ message: "Group deleted!" });
               });
           } else {
               res.status(200).json( { message: `Group have ${group.users.length} members. You can't delete it.` });
           }
        });
}

function addUserToGroup(req, res) {
    const groupId = req.params.id,
          userName = req.body.name;

    Group.findOne({ _id: groupId })
        .populate('users')
        .exec((err, group) => {
            if (err || !group) {
                return res.status(404).json({ message: "Group not found!"});
            }

            User.findOne({ name: userName}, (err, user) => {
                if (err || !user) {
                    return res.status(404).json({ message: "User not found!"});
                }

                const groupUser = group.users.find(user => user.name == userName );
                if (!groupUser) {
                    group.users.push(user);
                    group.save((err) => {
                        res.status(200).json({ message: `User ${user.name} added to group ${group.name}.`});
                    });
                } else {
                    return res.status(404).json({ message: "User already exist in group." });
                }
            });

        });
}

function deleteUserFromGroup(req, res) {
    const groupId = req.params.groupId,
          userId = req.params.userId;

    Group.findOne({ _id: groupId })
        .populate('users')
        .exec((err, group) => {
            if (err || !group) {
                return res.status(404).json({ message: "Group not found!"});
            }

            const groupUser = group.users.find(user => user._id == userId);
            if (groupUser) {
                const userIndex = group.users.indexOf(groupUser);
                group.users.splice(userIndex, 1);
                group.save((err) => {
                    res.status(200).json({ message: `User ${groupUser.name} deleted from group ${group.name}.`});
                });
            } else {
                return res.status(404).json({ message: "User don't exist in group." });
            }
        });
}
