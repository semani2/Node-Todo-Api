const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user')
const {seedTodos, populateTodos, seedUsers, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos); 

describe('POST /todos', () => {
    it('shoud create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.text).toBe(text);
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
        .set('x-auth', seedUsers[0].tokens[0].token)
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
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(200)
        .expect((response) => {
            expect(response.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${seedTodos[0]._id.toHexString()}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.text).toBe(seedTodos[0].text);
        })
        .end(done);
    });

    it('should not return a todo doc created by another user', (done) => {
        request(app)
        .get(`/todos/${seedTodos[2]._id.toHexString()}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${id}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get('/todos/123')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var id = seedTodos[2]._id.toHexString();
        request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', seedUsers[1].tokens[0].token)
        .expect(200)
        .expect((response) => {
            expect(response.body.todo._id).toBe(id);
        })
        .end((err, response) => {
            if(err) {
                return done(err);
            }

            Todo.findById({_id: id}).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((err) => done(err));
        });
    });

    it('should return 404 when try to delete a todo not created by the user', (done) => {
        var id = seedTodos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', seedUsers[1].tokens[0].token)
        .expect(404)
        .end((err, response) => {
            if(err) {
                return done(err);
            }

            Todo.findById({_id: id}).then((todo) => {
                expect(todo).toExist();
                done();
            }).catch((err) => done(err));
        });
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID();
        request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .delete('/todos/abc123')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update todo', (done) => {
        var id = seedTodos[0]._id.toHexString();
        var newText = 'Updated text';
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({
            text: newText,
            completed: true
        })
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.text).toBe(newText);
            expect(response.body.todo.completed).toBe(true);
            expect(response.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });

    it('should not update todo when logged in as another user', (done) => {
        var id = seedTodos[0]._id.toHexString();
        var newText = 'Updated text';
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', seedUsers[1].tokens[0].token)
        .send({
            text: newText,
            completed: true
        })
        .expect(404)
        .end(done);
    });

    it('should clear the completedAt when todo is not completed', (done) => {
        var id = seedTodos[1]._id.toHexString();
        var newText = 'Updated text';
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({
            text: newText,
            completed: false
        })
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.text).toBe(newText);
            expect(response.body.todo.completed).toBe(false);
            expect(response.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(200)
        .expect((response) => {
            expect(response.body._id).toBe(seedUsers[0]._id.toHexString());
            expect(response.body.email).toBe(seedUsers[0].email);
        })
        .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((response) => {
            expect(response.body).toEqual({}); // Use toEqual to compare empty objects
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123abc!';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((response) => {
            expect(response.headers['x-auth']).toExist();
            expect(response.body._id).toExist();
            expect(response.body.email).toBe(email);
        })
        .end((err) => {
            if(err) {
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

    it('should return validation error if request invalid', (done) => {
        var email = 'example@example.com';
        var password = '123a';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });

    it('should not create user if email is in use', (done) => {
        request(app)
        .post('/users')
        .send({
            'email': seedUsers[0].email,
            'password': seedUsers[0].password
        })
        .expect(400)
        .end(done);
    })
});

describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: seedUsers[1].email,
            password: seedUsers[1].password
        })
        .expect(200)
        .expect((response) => {
            expect(response.headers['x-auth']).toExist();
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            User.findById(seedUsers[1]._id).then((user) => {
                expect(user.tokens[1]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: seedUsers[1].email,
            password: 'wrongpassword'
        })
        .expect(400)
        .expect((response) => {
            expect(response.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            User.findById(seedUsers[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((err) => done(err));
        });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token when logout', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            User.findById(seedUsers[0]._id).then((user) => {
                if(err) {
                    return done(err);
                }
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((err) => done(err));
        })
    });
});