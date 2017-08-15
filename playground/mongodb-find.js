//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // ES6 object destructuring feature

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Error connecting to database');
    }
    console.log('Connected to mongo db server');

    // Find method with query
    db.collection('Todos').find({completed: true}).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    // Count method demo
    db.collection('Todos').find().count().then((count) => {
        console.log(`Number of Todos: ${count}`);
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    // Fetch users demo
    db.collection('Users').find({name: 'Sai'}).toArray().then((users) => {
        console.log('Users');
        console.log(JSON.stringify(users, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch users', err);
    });

    // Count users demo
    // Count method demo
    db.collection('Users').find().count().then((count) => {
        console.log(`Number of users: ${count}`);
    }, (err) => {
        console.log('Unable to fetch users', err);
    });



    //db.close();
});
