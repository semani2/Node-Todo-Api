var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// Todo Mongoose model
var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

// var newTodo = new Todo({
//     text: 'Cook dinner',
//     completed: false
// });

// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (err) => {
//     console.log('unable to save todo');
// });

var otherTodo = new Todo({
    text: 'Leave for Cincinnati',
    completed: true,
    completedAt: -1
});

otherTodo.save().then((doc) => {
    console.log('Saved todo', doc);
}, (err) => {
    console.log('unable to save todo');
});