const exp = require("express");
const app = exp();
const path = require('path'); // Core module

// Import the APIs
const userApp = require('./APIs/userapi');
const staffApp = require('./APIs/staffapi');

// Handover req to specific route based on start of paths
app.use('/user-api', userApp);
app.use('/staff-api', staffApp);

// Add body parser
app.use(exp.json());

//------------------------------------------------------------

//Replace react build in http web server
app.use(exp.static(path.join(__dirname,'../frontend/build')))


// Error Handler
app.use((err, req, res, next) => {
    res.send({ status: "Error", message: err.message });
});

// Link with MongoDB server
const mongoClient = require('mongodb').MongoClient; // Importing
mongoClient.connect("mongodb://127.0.0.1:27017/mongosh?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1")
    .then(client => {
        // Get database object
        const libDBObj = client.db('library');
        // Create collection objects
        const usersCollection = libDBObj.collection('users');
        const staffCollection = libDBObj.collection('staff');
        const booksCollection = libDBObj.collection('books');
        const categoryCollection = libDBObj.collection('category');
        // Share collection objs with APIs
        app.set('usersCollection', usersCollection);
        app.set('staffCollection', staffCollection);
        app.set('booksCollection', booksCollection);
        app.set('categoryCollection', categoryCollection);
        console.log('DB connection success');
    })
    .catch(err => {
        console.log("Err in DB connect", err);
    });

const port = 5000;
// Assign port number to HTTP server
app.listen(port, () => { console.log(`server on ${port}`); });
