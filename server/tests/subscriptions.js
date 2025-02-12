const { request, GraphQLClient } = require('graphql-request')

const graphqlEndpoint = "http://endor-vm2.cs.purdue.edu:4000/graphql";
const socketEndpoint = "http://endor-vm2.cs.purdue.edu:5000";

// INITIAL

function login (onSuccessCallbacks) {
    // create query
    const query = `mutation {
        login (email: "frontend@purdue", password: "abc") {
            jwt
        }
    }`

    // send request
    return request(graphqlEndpoint, query)
        .then(response => {
            console.log('logged in:', response);

            // create client with auth
            const client = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    Authorization: response.login.jwt,
                },
            });

            // run success callbacks w/ authed client
            for (let i=0; i<onSuccessCallbacks.length; i++) {
                setTimeout(function () {
                    onSuccessCallbacks[i](client);
                }, 4000 * i);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

// returns socket for automatic testing use
function createSocket (type) {
    // create
    const socket = require('socket.io-client')(socketEndpoint);

    // handle new connection
    socket.on('connect', function () {
        console.log('Connected to subscriptions:', type);
    });

    // handle disconnection
    socket.on('disconnect', function () {
        console.log('Disconnected from subscriptions:', type);
    });

    // ready
    return socket;
}

// QUIZ UPDATED

function subscription_quiz_updated (client) {
    console.log('Running Quiz Updated Tests');
    console.log('==========================');

    // open a quiz
    openQuiz(client);

    // prep socket for data transfer
    setTimeout(function () {
        // init
        const socket = createSocket('quiz_updated');

        // subscribe to the quiz_updated event,
        // send what course to watch
        socket.emit('subscribe', 'quiz_updated', 828831);

        // attach quiz updated listener
        socket.on('quiz_updated', function (quiz) {
            handleUpdatedQuiz(socket, quiz);
        });

        // close a quiz
        setTimeout(function () {
            closeQuiz(client);
        }, 1000);
    }, 1000);
}

// handles updated quiz
function handleUpdatedQuiz (socket, quiz) {
    // show data from updated quiz
    console.log('quiz updated:', quiz);

    // unsubscribe from the quiz_updated event
    socket.emit('unsubscribe', 'quiz_updated', 828831);

    // close when done
    socket.disconnect();

    // done
    console.log('Done\n');
}

// opens a quiz in the database
function openQuiz (client) {
    // create query
    const query = `mutation {
        quizUpdate (id: 12, input: {
            title: "Subscriptions Test"
            courseID: 828831
            qCount: 5
            date: "04202018"
            isOpen: true
        }) {
            id
            title
            courseID
            qCount
            date
            isOpen
        }
    }`

    // send request
    client.request(query)
        .then(response => {
            console.log('Attempted to open quiz 12 in course 828831...', response);
        })
        .catch(err => {
            console.log(err);
        });
}

// closes a quiz in the database
function closeQuiz (client) {
    // create query
    const query = `mutation {
        quizUpdate (id: 12, input: {
            title: "Subscriptions Test"
            courseID: 828831
            qCount: 5
            date: "04202018"
            isOpen: false
        }) {
            id
            title
            courseID
            qCount
            date
            isOpen
        }
    }`

    // send request
    client.request(query)
        .then(response => {
            console.log('Attempted to close quiz 12 in course 828831...', response);
        })
        .catch(err => {
            console.log(err);
        });
}

// QUIZ ANSWER CREATED

function subscription_quiz_answer_created (client) {
    console.log('Running Quiz Answer Created Tests');
    console.log('=================================');

    // init
    const socket = createSocket('quiz_answer_created');

    // subscribe to the quiz_answer_created event,
    // send what quiz to watch
    socket.emit('subscribe', 'quiz_answer_created', 1);

    // attach quiz answer created listener
    socket.on('quiz_answer_created', function (quizAnswer) {
        handleQuizAnswerCreated(socket, quizAnswer);
    });

    // close a quiz
    setTimeout(function () {
        createQuizAnswer(client);
    }, 2000);
}

// handles quiz answer created
function handleQuizAnswerCreated (socket, quizAnswer) {
    // show data from created quiz answer
    console.log('quiz answer created:', quizAnswer);

    // unsubscribe from the quiz_updated event
    socket.emit('unsubscribe', 'quiz_answer_created', 1);

    // close when done
    socket.disconnect();

    // done
    console.log('Done\n');
}

// handles creating a quiz answer
function createQuizAnswer (client) {
    // create query
    const query = `mutation {
        answerCreate (input: {
            userID: 1
            questionID: 1
            quizID: 1
            type: "tf"
            content: "True"
        }) {
            id
            userID
            questionID
            quizID
            type
            content
        }
    }`

    // send request
    client.request(query)
        .then(response => {
            console.log('Attempted to create quiz answer...', response);
        })
        .catch(err => {
            console.log(err);
        });
}

// FEEDBACK CREATED

function subscription_feedback_created (client) {
    console.log('Running Feedback Created Tests');
    console.log('=================================');

    // init
    const socket = createSocket('feedback_created');

    // subscribe to the feedback_created event
    socket.emit('subscribe', 'feedback_created');

    // attach feedback created listener
    socket.on('feedback_created', function (feedback) {
        handleFeedbackCreated(socket, feedback);
    });

    // create a Feedback
    setTimeout(function () {
        createFeedback(client);
    }, 2000);
}

// handles feedback created
function handleFeedbackCreated (socket, feedback) {
    // show data from created feedback
    console.log('feedback created:', feedback);

    // unsubscribe from the feedback_created event
    socket.emit('unsubscribe', 'feedback_created');

    // close when done
    socket.disconnect();

    // done
    console.log('Done\n');
}

function createFeedback (client) {
    // create query
    const query = `mutation {
        feedbackCreate (input: {
            userID: 6
            content: "Subscriptions Test"
            date: "04202018"
        }) {
            id
            userID
            content
            date
        }
    }`

    // send request
    client.request(query)
        .then(response => {
            console.log('Attempted to create feedback...', response);
        })
        .catch(err => {
            console.log(err);
        });
}

// TESTALL

login([subscription_quiz_updated, subscription_quiz_answer_created, subscription_feedback_created]);