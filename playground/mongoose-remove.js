const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const {ObjectID} = require('mongodb');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findAndOneRemove({_id: ''}).then((todo) => {

// }).catch((err) => {

// });

Todo.findByIdAndRemove('59947d362b35b077f1a95315').then((todo) => {
    console.log(todo);
}).catch((err) => {
    console.log(err);
});