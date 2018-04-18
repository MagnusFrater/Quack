// set up socket.io
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log('socket connected');

    socket.on('disconnect', function () {
        console.log('disconnected');
    });
});
server.listen(5000);
// setup the rest of the server

require('dotenv').config();

var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

import types from './graphql/types';
import rootValue from './graphql/resolvers';
import sqlConnector from './graphql/connectors';

require('dotenv').config();

var config;
var cors = require('cors');

console.log(process.env.PLS_WORK);
// Create connection to database
var prodConfig = {
  userName: "sa",//process.env.DB_P_USER,
  password: "goddtriffin#1334",//process.env.DB_P_PASS,
  server: "localhost",//process.env.DB_P_ENDPOINT,
  database: "quackDB",//process.env.DB_P_NAME,
  options: {
     encrypt: true,
     database: "quackDB",//process.env.DB_P_NAME,
     rowCollectionOnRequestCompletion: true
  }
}

var localConfig = {
    userName: process.env.DB_T_USER,
    password: process.env.DB_T_PASS, 
    server: process.env.DB_T_ENDPOINT,
    database: process.env.DB_T_NAME,
    options: {
        database: process.env.DB_T_NAME,
        rowCollectionOnRequestCompletion: true
    }
}

if(process.argv.length != 3) {
    console.log("Usage: node server.js <type>");
    process.exit(1);
}

if(process.argv[2] == "p" ) {
    config = prodConfig;
}
else if(process.argv[2] == "l") {
    config = localConfig;
}
else {
    console.log("Incorrect server type. Use either 'p' or 'l' to connect to local or production database ");
    process.exit(1);
}

console.log(types);
console.log(rootValue);

const schema = buildSchema(types);
const sqlDB = new sqlConnector(config);
var app = express();

app.use(cors());

app.use('/graphql', (req, res) => {
    return graphqlHTTP({
        schema: schema,
        rootValue,
        context: { 
            headers: req.headers,
            db: sqlDB,
            JWT_SECRET: "quackmedaddy"
        },
        graphiql: true,
    }) (req, res);
})

app.listen(4000, '0.0.0.0');
console.log('Running a GraphQL API server at http://endor-vm2.cs.purdue.edu:4000/graphql');