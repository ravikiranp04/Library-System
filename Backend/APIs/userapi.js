const exp = require("express");
const userApp = exp.Router();
const { createUserOrStaff, loginUserOrStaff } = require('./Util');
const expresshandler = require("express-async-handler");

// Add body parser
userApp.use(exp.json());

// Middleware to set up collections
let usersCollection;
let booksCollection;
let categoryCollection
userApp.use((req, res, next) => {
    usersCollection = req.app.get('usersCollection');
    booksCollection=req.app.get('booksCollection')
    categoryCollection=req.app.get('categoryCollection')
    next();
});

// User Creation 
userApp.post('/user', expresshandler(createUserOrStaff));

// User Login
userApp.post('/login', expresshandler(loginUserOrStaff));


//Renewal 
userApp.put('/renewal_user/:bookId',expresshandler(async(req,res)=>{
    const Id=(+req.params.bookId);
    const bk= await booksCollection.findOne({bookId:Id});
   if(bk.renewalCount==0){
    const retDate = new Date();
    retDate.setDate(retDate.getDate() + 7);
    bk.returnDate = retDate.toISOString();
    bk.renewalCount=1;
    console.log(bk)
    await booksCollection.updateOne({bookId:bk.bookId},{$set:{...bk}})
    res.send({message:"Renewal Successful"})
   }
   else{
    res.send({message:"Renewal rejected"})
   }
}))

//Display Borrow books
userApp.get('/display_borrow/:username',expresshandler(async(req,res)=>{
    const user_name=req.params.username;
    const borrowList=await booksCollection.find({username:user_name,borrowStatus:true}).toArray();
    if(borrowList.length>0){
        res.send({message:"Borrowed Books are",payload:borrowList})

    }
    else{
        res.send({message:"No Books Found"})
    }
}))



//Display Previous Borrowed books
userApp.get('/display_borrow_prev/:username',expresshandler(async(req,res)=>{
    const user_name=req.params.username;
    const borrowList=await booksCollection.find({'previousHistory.username':user_name},{ bookId: 1, title: 1, author: 1 ,previousHistory:1}).toArray();
    if(borrowList.length>0){
        res.send({message:"Previous Borrowed Books are",payload:borrowList})

    }
    else{
        res.send({message:"No Books Found"})
    }
}))
// Export userApp
module.exports = userApp;
