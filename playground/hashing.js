const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPassword = '$2a$10$I.Yhnmbn2maetLn6jz.GWetN1xlUW7VhMhNlJjBVVsqJdNPN5ITGa';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});
// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(`Token: ${token}`);

// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// var msg = 'I am user number 1';

// var hash = SHA256(msg).toString();

// console.log(`Hash: ${hash} for msg ${msg}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed');
// }
// else {
//     console.log('Data changed, Do not trust');
// }