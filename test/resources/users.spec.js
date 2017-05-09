
const chai = require('chai'),
      expect = chai.expect,
      request = require('supertest'),
      async = require('async'),
      server = require('../../app/server'),
      User = require('../../app/models/User'),
      usersData = require('../../app/data/seedData.json').users;


describe('Users routes:', function () {

    const availableRoutes = {
        getAll: { describe: "GET /api/users", verb: "GET", path: "/api/users" },
        getSingle: { describe: "GET /api/users/:id", verb: "GET", path: "/api/users/:id" },
        post: { describe: "POST /api/users", verb: "POST", path: "/api/users" },
        put: { describe: "PUT /api/users/:id", verb: "PUT", path: "/api/users/:id" },
        delete: { describe: "DELETE /api/users/:id", verb: "DELETE", path: "/api/users/:id" }
    };

    describe(availableRoutes.getAll.describe, function () {
        before(function (done) {
            seedDB(false, done);
        });

        context('The users exists', function () {
            it('should respond with JSON', function (done) {
                 request(server)
                     .get(availableRoutes.getAll.path)
                     .set('Accept', 'application/json')
                     .expect('Content-Type', /json/)
                     .expect(200, done)
             });
            it('should respond with a 200 code', function (done) {
                request(server)
                    .get(availableRoutes.getAll.path)
                    .expect(200, done)
            });
            it('should return list of users', function (done) {
                request(server)
                    .get(availableRoutes.getAll.path)
                    .expect(200)
                    .end((err, res) => {
                       //console.log(res.body);
                       expect(res.body).to.have.length(3);
                       expect(res.body[0].name).to.eql("John");
                       expect(res.body[1].name).to.eql("Nick");
                       expect(res.body[2].name).to.eql("Pete");
                       done(err);
                    });
            });
        });

        context('The users does not exists', () => {
            beforeEach(function (done) {
               User.remove({}, function (err) { done(err) });
            });

            it('will respond with a 404 code', function (done) {
                request(server)
                    .get(availableRoutes.getAll.path)
                    .expect(404)
                    .end((err, res) => {
                        //console.log(res.body);
                        expect(res.body).to.have.property('message');
                        expect(res.body.message).to.eql("Users not found!");
                        done(err);
                    });
            });
        });
    });

    describe(availableRoutes.getSingle.describe, function () {
        before(function (done) {
            seedDB(true, done);
        });

        context('The user exists', function () {
            it('should respond with JSON', function (done) {
                request(server)
                    .get(availableRoutes.getSingle.path.replace(':id', '1'))
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200, done)
            });
            it('should respond with a 200 code', function (done) {
                request(server)
                    .get(availableRoutes.getSingle.path.replace(':id', '1'))
                    .expect(200, done)
            });
            it('should return a correct user', function (done) {
                request(server)
                    .get(availableRoutes.getSingle.path.replace(':id', '1'))
                    .expect(200)
                    .end((err, res) => {
                        //console.log(res.body);
                        expect(res.body.name).to.eql("John");
                        done(err);
                    });
            });
        });

        context('The user does not exists', () => {
            // beforeEach(function (done) {
            //     User.remove({}, function (err) {
            //         done(err)
            //     });
            // });
            const searchedUserId = '25';

            it('will respond with a 404 code', function (done) {
                request(server)
                    .get(availableRoutes.getSingle.path.replace(':id', searchedUserId))
                    .expect(404)
                    .end((err, res) => {
                        //console.log(res.body);
                        expect(res.body).to.have.property('message');
                        expect(res.body.message).to.eql("User not found!");
                        done(err);
                    });
            });
        });
    });

    describe(availableRoutes.post.describe, function () {
        const postData = {name: "Luke", email: "sky-walker@gmail.com"};

        context('The user should be created.', function () {
            it('should respond with JSON', function (done) {
                request(server)
                    .post(availableRoutes.post.path)
                    .set('Accept', 'application/json')
                    .send(postData)
                    .expect('Content-Type', /json/)
                    .expect(201, done)
            });
            it('should respond with a 201 code', function (done) {
                request(server)
                    .post(availableRoutes.post.path)
                    .send(postData)
                    .expect(201, done)
            });
            it('should create a user and return it', function (done) {
                request(server)
                    .post(availableRoutes.post.path)
                    .send(postData)
                    .expect(201)
                    .end((err, res) => {
                        //console.log(res.body);
                        expect(res.body.name).to.eql("Luke");
                        expect(res.body.email).to.eql("sky-walker@gmail.com");
                        done(err);
                    });
            });
        });

        //TODO: figure out do I need to test "Server error" 500?
        // context('Server error.', () => {
        //     // beforeEach(function (done) {
        //     //     User.remove({}, function (err) {
        //     //         done(err)
        //     //     });
        //     // });
        //
        //     it('will respond with a 500 code', function (done) {
        //         request(server)
        //             .post(availableRoutes.post.path)
        //             .send(postData)
        //             .expect(500)
        //             .end((err, res) => {
        //                 //console.log(res.body);
        //                 expect(res.body).to.have.property('message');
        //                 expect(res.body.message).to.eql("User not found!");
        //                 done(err);
        //             });
        //     });
        // });
    });

    describe(availableRoutes.put.describe, function () {
        before(function (done) {
            seedDB(true, done);
        });

        const putData = {name: "Luke", email: "sky-walker@gmail.com"};

        context('The user should be updated.', function () {
            const searchedUserId = '1';
            it('should respond with JSON', function (done) {
                request(server)
                    .put(availableRoutes.put.path.replace(':id', searchedUserId))
                    .set('Accept', 'application/json')
                    .send(putData)
                    .expect('Content-Type', /json/)
                    .expect(200, done)
            });
            it('should respond with a 200 code', function (done) {
                request(server)
                    .put(availableRoutes.put.path.replace(':id', searchedUserId ))
                    .send(putData)
                    .expect(200, done)
            });
            it('should update a user and return it', function (done) {
                request(server)
                    .put(availableRoutes.put.path.replace(':id', searchedUserId))
                    .send(putData)
                    .expect(200)
                    .end((err, res) => {
                        //console.log(res.body);
                        expect(res.body).to.have.property('_id');
                        expect(res.body._id).to.be.a('number');
                        expect(res.body.name).to.eql("Luke");
                        expect(res.body.email).to.eql("sky-walker@gmail.com");
                        done(err);
                    });
            });
        });

        context('The user should be not found', () => {
            const searchedUserId = '25';

            it('will respond with a 404 code', function (done) {
                request(server)
                    .put(availableRoutes.put.path.replace(':id', searchedUserId))
                    .send(putData)
                    .expect(404)
                    .end((err, res) => {
                        //console.log(res.body);
                        expect(res.body).to.have.property('message');
                        expect(res.body.message).to.eql("User not found!");
                        done(err);
                    });
            });
        });
    });

    describe(availableRoutes.delete.describe, function () {
        before(function (done) {
            seedDB(true, done);
        });

        context('The user should be removed.', function () {
            const searchedUserId = '2';
            it('should respond with a 204 code and remove a user', function (done) {
                request(server)
                    .delete(availableRoutes.delete.path.replace(':id', searchedUserId ))
                    .expect(204)
                    .end((err, res) => done(err));
            });
        });
    });
});

function seedDB(resetKeys, done) {
    if (resetKeys) {
        const user = new User();
        user.resetCount(function(err, nextCount) {});
    }

    User.remove({}, function () {
        async.series({
            firstUser: function(callback) {
                const user = new User(usersData[0]);
                user.save(callback);
            },
            secondUser: function(callback){
                const user = new User(usersData[1]);
                user.save(callback);
            },
            thirdUser: function(callback){
                const user = new User(usersData[2]);
                user.save(callback);
            }
        }, function(err, results) {
            // results is now equal to: {firstUser: [], secondUser: []}
            done(err);
        });

        // User.insertMany(usersData, function(error, docs) {
        //     //console.log('inside before hook: ', docs);
        //     fakeUser = docs[0];
        //     //console.log('inside before hook: ', fakeUser);
        //     done(error);
        // });
    });
}
