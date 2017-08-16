const {MongoClient, ObjectID} = require('mongodb'); // ES6 object destructuring feature

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Error connecting to database');
    }
    console.log('Connected to mongo db server');

    // Find one and update
    db.collection('Todos').findOneAndUpdate({
        text: 'Eat lunch'
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    db.collection('Users').findOneAndUpdate({
        name: 'Sai Prajnan'
    }, {
        $set: {
            name: 'Sai Prajnan Emani'
        }, 
        $inc: {
            age: 1
        }
    }, {
            returnOriginal: false
    }).then((result) => {
        console.log(result);
    })
    //db.close();
});
