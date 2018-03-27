import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sqlConnector from '../connectors';

var TYPES = require('tedious').TYPES;

var argSQL = {};

require('dotenv').config();

class User {
    constructor(id, {firstName, lastName, email}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.courses = [];
    }

    // addCourse () {}
}


export default {
    // Query //

    users: (args, context) => {
        // Read all rows from table
        argSQL = {}
        //argSQL[0] = {name: 'id', type: TYPES.Int, arg: args.id};
        return context.db.executeSQL("SELECT * FROM TestSchema.Users", argSQL, true);

    },

    user: async (args, context) => {
        // make sure User with given id actually exists
        /*if(!getUser(context.headers)) {
            return null;
        }
        else{*/
        argSQL = {}
        argSQL[0] = {name: 'email', type: TYPES.NVarChar, arg: args.email};
        return context.db.executeSQL("SELECT * FROM TestSchema.Users where email = @email", argSQL, false);
        //}
    },
    
    // Mutation //

    login: async (args, context) => {
        argSQL = {};

        const users = await context.db.executeSQL("SELECT email, password FROM TestSchema.Users", argSQL, true);
        var emails = users.map(a => a.email);
        if(emails.indexOf(args.email) == -1) {
            return new Error("Email does not exist");
        }
        else {

            //Not in the array
            const dbPassword = users[emails.indexOf(args.email)].password;
            const validPassword = await bcrypt.compare(args.password, dbPassword);
            if (!validPassword) {
                return new Error("Password is incorrect");
            }
            
            argSQL[0] = {name: 'email', type: TYPES.NVarChar, arg: args.email};
            const sql = await context.db.executeSQL("SELECT * FROM TestSchema.Users where email = @email", argSQL, false);
            sql.jwt = jwt.sign({ id: sql.id }, context.JWT_SECRET);
            return sql;
        }
    },    

    userCreate: async (args, context) => {
        // (TEMPORARY FIX) use fakeDatabase's size to create initial id

        // update database with new User (potentially async task)

        // return newly created User to client
        argSQL = {};
        const users = await context.db.executeSQL("SELECT email FROM TestSchema.Users", argSQL, true);
        var emails = users.map(a => a.email);
        if(emails.indexOf(args.input.email) > -1) {
            return new Error("Email already exists");
        }
        else {

            console.log("creating user");
            //Not in the array
            const hash = await bcrypt.hash(args.password, 10);
            argSQL[0] = {name: 'firstName', type: TYPES.NVarChar, arg: args.input.firstName};
            argSQL[1] = {name: 'lastName', type: TYPES.NVarChar, arg: args.input.lastName};
            argSQL[2] = {name: 'email', type: TYPES.NVarChar, arg: args.input.email};
            argSQL[3] = {name: 'password', type: TYPES.NVarChar, arg: hash};

            //console.log(argSQL);
            const sql = await context.db.executeSQL( 

            "INSERT INTO TestSchema.Users (firstName, lastName, email, password) OUTPUT " + 
             "INSERTED.id, INSERTED.firstName, INSERTED.lastName, INSERTED.email VALUES (@firstName, @lastName, @email, @password);", 
            argSQL, false);
            sql.jwt = jwt.sign({ id: sql.id }, context.JWT_SECRET);
            return sql;
        }
    },

    userUpdate: (args, context) => {
        // make sure User with given id actually exists
        console.log("ARGUMENTS " + args.id);
        argSQL = {};
        argSQL[0] = {name: 'id', type: TYPES.Int, arg: args.id};
        argSQL[1] = {name: 'firstName', type: TYPES.NVarChar, arg: args.input.firstName};
        argSQL[2] = {name: 'lastName', type: TYPES.NVarChar, arg: args.input.lastName};
        argSQL[3] = {name: 'email', type: TYPES.NVarChar, arg: args.input.email};

        return context.db.executeSQL( 
            "UPDATE TestSchema.Users SET " + 
             "firstName = @firstName, lastName = @lastName, email = @email " + 
             "OUTPUT INSERTED.id, INSERTED.firstName, INSERTED.lastName, INSERTED.email WHERE id = @id;", 
            argSQL, false);
    },

    userAddCourse: (args, context) => {
        console.log(args.c_id);
        argSQL = {}
        argSQL[0] = {name: 's_id', type: TYPES.Int, arg: args.id};
        argSQL[1] = {name: 'c_id', type: TYPES.Int, arg: args.c_id};
        return context.db.executeSQL("if not exists (select * from TestSchema.UsersCourses d where d.s_id = @s_id and d.c_id = @c_id) " + 
            "INSERT INTO TestSchema.UsersCourses (s_id, c_id) VALUES (@s_id, @c_id) " + 
            "SELECT c.id, name FROM TestSchema.UsersCourses sc " +  
            "INNER JOIN TestSchema.Courses c ON c.id = sc.c_id WHERE sc.s_id = @s_id ", argSQL, true);
    },

    userGetCourses: (args, context) => {
        argSQL = {}
        argSQL[0] = {name: 'id', type: TYPES.Int, arg: args.id};
        return context.db.executeSQL("SELECT c.id, name FROM TestSchema.UsersCourses sc " + 
            "INNER JOIN TestSchema.Courses c ON c.id = sc.c_id WHERE sc.s_id = @id", argSQL, true);
    }
}

const getUser = async (args, context) => {
    const { ok, result } = await new Promise(resolve =>
      jwt.verify(token, secrets.JWT_SECRET, (err, result) => {
        if (err) {
          resolve({
            ok: false,
            result: err
          });
        } else {
          resolve({
            ok: true,
            result
          });
        }
      })
    );

    if (ok) {
      return true;
    } else {
      console.error(result);
      return false;
    }
  
    return false;
};