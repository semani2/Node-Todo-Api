const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const seedTodos = [{
        text: 'Todo 1'
    }, {
        text: 'Todo 2'
    }, {
        text: 'Todo 3'
    }];

beforeEach((done)=> {
    // Setting up database before each test case
    Todo.remove({}).then(() => {
        return Todo.insertMany(seedTodos);
    }).then(() => {
        done();
    })
})

describe('POST /todos', () => {
    it('shoud create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((response) => {
            expect(response.body.text).toBe(text);
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => {
                done(e);
            })
        });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(seedTodos.length);
                done();
            }).catch((e) => {
                done(e);
            })
        });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((response) => {
            expect(response.body.todos.length).toBe(seedTodos.length);
        })
        .end(done);
    })
});