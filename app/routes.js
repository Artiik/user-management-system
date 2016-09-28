
// require dependencies
const express = require('express'),
      router = express.Router(),
      usersController = require('./controllers/users.controller'),
      groupsController = require('./controllers/groups.controller');

// export router
module.exports = router;

// api routes ==============================================

// users routes ============================================

//get all
router.get('/api/users', usersController.getAll);

//create single
router.post('/api/users', usersController.createSingle);

// seed all
router.get('/api/users/seed', usersController.seedAll);

// get single
router.get('/api/users/:id', usersController.getSingle);

//update single
router.put('/api/users/:id', usersController.putSingle);

//delete single
router.delete('/api/users/:id', usersController.deleteSingle);

// group routes ==============================================

//get all
router.get('/api/groups', groupsController.getAll);

//create single
router.post('/api/groups', groupsController.createSingle);

// seed all
router.get('/api/groups/seed', groupsController.seedAll);

// get single
router.get('/api/groups/:id', groupsController.getSingle);

//update single
router.put('/api/groups/:id', groupsController.putSingle);

//delete single
router.delete('/api/groups/:id', groupsController.deleteSingle);

//get users of a specified group
//router.get('/api/groups/:id/users', groupsController.getGroupUsers);

//add user to group
router.post('/api/groups/:id/users', groupsController.addUserToGroup);

//remove user from group
router.delete('/api/groups/:groupId/users/:userId', groupsController.deleteUserFromGroup);


// site routes

//catchall route
router.use((req, res, next) => {
    res.status(404).json({ message: 'Path not found!' });
});
