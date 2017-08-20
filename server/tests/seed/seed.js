const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const seedUsers = [{
    _id: userOneId,
    email: 'sp1@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userOneId.toHexString(), 
            access: 'auth'
        }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'sp2@gmail.com',
    password: 'userTwoPass'
}];

const seedTodos = [{
    _id: new ObjectID(),
    text: 'Todo 1'
}, {
    _id: new ObjectID(),
    text: 'Todo 2',
    completed: true,
    completedAt: 333
}, {
    _id: new ObjectID(),
    text: 'Todo 3'
}];

const populateTodos = (done) => {
    // Setting up database before each test case
    Todo.remove({}).then(() => {
        return Todo.insertMany(seedTodos);
    }).then(() => {
        done();
    })
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(seedUsers[0]).save();
        var userTwo = new User(seedUsers[1]).save();

        //Wait for both the promises to complete in the all method 
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}

module.exports = {
    populateTodos,
    seedTodos,
    populateUsers,
    seedUsers
};