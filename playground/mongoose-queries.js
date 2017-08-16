const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const {ObjectID} = require('mongodb');

var id = '59945f5ca133133495bbb1a211'; // Object Id of a todo from the db
var userId = '59944ad8fe00d926e63d8455';

if(!ObjectID.isValid(id)) {
    console.log('ID not valid');
}
Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
    if( !todo) {
        return console.log('ID not found');
    }
    console.log('Todo by Find By Id ', todo);
}).catch((err) => {
    console.log(err);
});

User.findById(userId).then((user) => {
    if( !user) {
        return console.log('User with Id not found');
    }
    console.log('User by Find By Id ', user);
}, (err) => {
    console.log(err);
});

