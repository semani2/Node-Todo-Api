const {MongoClient, ObjectID} = require('mongodb'); // ES6 object destructuring feature

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Error connecting to database');
    }
    console.log('Connected to mongo db server');

    // Delete Many
    // db.collection('Todos').deleteMany({text: 'Eat Lunch'})
    // .then((result) => {
    //     console.log(result);
    // });
    
    // Delete one
    // db.collection('Todos').deleteOne({text: 'Eat dinner'})
    // .then((result) => {
    //     console.log(result);
    // });

    // find one and delete
    // db.collection('Todos').findOneAndDelete({text: 'Eat dinner'})
    // .then((result) => {
    //     console.log(result); //result.value will have the deleted object
    // });

    // Delete many users
    db.collection('Users').deleteMany({age: 15})
    .then((result) => {
        console.log(result);
    });

    //db.close();
});
