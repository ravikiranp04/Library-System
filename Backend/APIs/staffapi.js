const exp=require("express")
const staffApp=exp.Router()
const {createUserOrStaff,loginUserOrStaff}=require('./Util')
const expresshandler=require('express-async-handler')
const { setFlagsFromString } = require("v8")
const { executionAsyncId } = require("async_hooks")

//add body parser
staffApp.use(exp.json())
//---------------------------------------------
let staffCollection;
let booksCollection;
let categoryCollection
let usersCollection;
staffApp.use((req,res,next)=>{
    staffCollection=req.app.get('staffCollection')
    booksCollection=req.app.get('booksCollection')
    usersCollection = req.app.get('usersCollection');
    categoryCollection=req.app.get('categoryCollection')
    next()
})
//Author create
staffApp.post('/user',expresshandler(createUserOrStaff))

//author Login
staffApp.post('/login',expresshandler(loginUserOrStaff))


//to add new book
staffApp.post('/add-book',expresshandler(async(req,res)=>{
    let bookdetails= req.body;
    console.log(bookdetails)
    await booksCollection.insertOne(bookdetails)
    res.send({message:"Book Added",payload:bookdetails})
}))


//to remove new book(soft delete)
staffApp.put('/removeBookById/:bookId',expresshandler(async(req,res)=>{
    const modifiedbook=req.body
    console.log(modifiedbook)
    if(modifiedbook.status==false){
        await booksCollection.updateOne({bookId:modifiedbook.bookId},{$set:{...modifiedbook}})
        res.send({message:"Book deleted"})
    }
    else{
        res.send({message:"Book In Borrow. Canot be deleted"})
    }
   
}))


staffApp.post('/addCategory',expresshandler(async(req,res)=>{
    const booke=req.body
    const tit= await categoryCollection.findOne({title:booke.title})
    if(tit!=undefined){
        res.send({message:"Enter a unique title"})
    }
    else{
        await categoryCollection.insertOne(booke)
        res.send({message:"Category Created"})
    }
}))

// book borrow route
staffApp.put('/borrow/:bookid/:username', expresshandler(async (req, res) => {
    const id = (+req.params.bookid);
    const uname = req.params.username;
    console.log(id);
    console.log(uname);

    const validuser = await usersCollection.findOne({ username: uname });


    if (validuser != null) {
        // Book allocation process should be inside this block
        const tit = await booksCollection.findOne({ bookId: id });
     

        if (tit != null && tit.borrowStatus == false) {
            const returnDate = new Date();
            tit.dateofBorrow = returnDate.toISOString();
            returnDate.setDate(returnDate.getDate() + 7);
            tit.returnDate = returnDate.toISOString();
            tit.borrowStatus = true;
            tit.username = uname; // Assuming uname is the username of the borrower

  

            // Update the document in the collection
            await booksCollection.findOneAndUpdate(
                { bookId: id },
                { $set: tit },
                { returnOriginal: false }
            );

            // Fetch the updated document to verify
            //let updatedBook = await booksCollection.findOne({ bookId: id });
            //console.log(updatedBook)

            res.send({ message: "Borrow Successful" });
        } else if (tit != null && tit.borrowStatus == true) {
            res.send({ message: "Book already Issued" });
        } else {
            res.send({ message: "Book Not Found" });
        }
    } else {
        res.send({ message: "User Not Found" });
    }
}));


// Renew a book

staffApp.put('/renewal_staff/:bookId',expresshandler(async(req,res)=>{
    const Id=(+req.params.bookId);
    const bk= await booksCollection.findOne({bookId:Id});
    const retDate = new Date();
    retDate.setDate(retDate.getDate() + 7);
    bk.returnDate = retDate.toISOString();
    bk.renewalCount=0;
    console.log(bk)
    await booksCollection.findOneAndUpdate({bookId:Id},{$set:bk},{ returnOriginal: false })
    res.send({message:"Renewal Successful"})
}))

//return a book
staffApp.put('/return/:bookId',expresshandler(async(req,res)=>{
    const Id=(+req.params.bookId);
    const bk= await booksCollection.findOne({bookId:Id});
    if(bk!=undefined){
        let prev={};
        prev.username=bk.username
        prev.dateofBorrow=bk.dateofBorrow
        prev.returnDate=new Date().toISOString()
    
        bk.username=""
        bk.dateofBorrow=""
        bk.returnDate=""
        bk.renewalCount=0;
        bk.borrowStatus=false
       bk.previousHistory.push(prev)
        
        await booksCollection.updateOne({bookId:bk.bookId},{$set:{...bk}})
        res.send({message:"Return Successful"})
    }
    else{
        res.send({message:"Book Not found"})
    }
    
}))

//Display Borrow books
staffApp.get('/display_books',expresshandler(async(req,res)=>{
    const borrowList=await booksCollection.find().toArray();
    if(borrowList.length>0){
        res.send({message:"Books are",payload:borrowList})

    }
    else{
        res.send({message:"No Books Available"})
    }
}))









//export staffApp
module.exports=staffApp