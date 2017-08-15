//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // ES6 object destructuring feature

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Error connecting to database');
    }
    console.log('Connected to mongo db server');

    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if(err) {
            return console.log('Unable to insert todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    //Insert new doc into Users collection
    var user1 = {
        name: 'Sai',
        age: 25,
        location: 'Raleigh, NC'
    };
    db.collection('Users').insertOne(user1, (err, result) => {
        if(err) {
            return console.log('Unable to insert into users', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id.getTimestamp());
    });

    db.close();
});
