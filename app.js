const express = require("express");
const app = express();
//alternative
// const app = require('express)()

const fs = require('fs')  //storagema vayko image lai del garnu parda yo apply garni

const connectToDatabase = require("./database");
const Book = require("./database/model/bookModel");

//Multerconfig imports
 
const { multer, storage } = require("./middleware/multerConfig");
const upload = multer({ storage : storage });


// cors package
const cors = require('cors')

app.use(cors({ origin : '*' }))

app.use(express.json());   //app is part of the express

connectToDatabase();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success",
  });
});

//Create books

app.post("/book", upload.single("image"), async(req,res)=>{
    // console.log(req.file)
    let fileName ;
    if(!req.file){
      fileName = "https://image.cnbcfm.com/api/v1/image/104226433-GettyImages-186974059.jpg?v=1648224136"
    }else{
      fileName = "http://localhost:3000/" + req.file.filename
    }
    const {bookName, bookPrice, isbNumber, authorName, publishedAt, publication} = req.body;
    await Book.create({
      bookName,   
      bookPrice,
      isbNumber,
      authorName,    
      publishedAt, 
      publication,
      imageUrl : fileName
    }) 
    res.status(201).json({
      message: "Book created sucessfully",
    });
  })

// All  read  

app.get("/book", async (req, res) => { 
  const books = await Book.find(); // return array ma garxa.
  console.log(books);

  res.status(200).json({
    message : "Books fetched successfully",
    data : books,
  });
});

//single read

// const id = req.params.id
// const book = await Book.findById(id)  // return object garxa
//     res.status(200).json({
//      message : " Single Book fetched successfully",
//      data : book,
//     })


//Single read with try catch method

app.get("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id); // return object garxa
    if (!book) {
      res.status(400).json({
        message: " Nothing Found ",
      });
    } else {
      res.status(200).json({
        message: "Single Book fetched successfully",
        data: book,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//delete operation

app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;
  await Book.findByIdAndDelete(id);
  res.status(200).json({
    message: "Book Deleted Successfully",
  });
}); 

//update operation
app.patch("/book/:id", upload.single('image'), async (req, res) => {
  const id = req.params.id;  // kun book update garney id ho yo
  const {bookName,bookPrice,authorName,publication,publishedAt,isbNumber} = req.body
  const oldDatas = await Book.findById(id)
  let fileName;
  
  if(req.file){
    const oldImagePath = oldDatas.imageUrl
    console.log(oldImagePath)
    const localHostUrlLength ="http://localhost:3000/".length
    const newOldImagePath = oldImagePath.slice(localHostUrlLength)
    console.log(newOldImagePath)
    fs.unlink(`storage/${newOldImagePath}`,(err)=>{
      if(err){
        console.log(err)
      }else{
        console.log('file deleted sucessfully')
      }
    })
    fileName = 'http://localhost:3000/' + req.file.filename
  }
  await Book.findByIdAndUpdate(id, {
    // bookName,
    // bookPrice, 
    // authorName,
    // publication,
    // publishedAt, 
    // isbNumber    //other method

    bookName : bookName,
    bookPrice : bookPrice, 
    authorName : authorName, 
    publication : publication,
    publishedAt : publishedAt,
    isbNumber : isbNumber,
    imageUrl : fileName
  });
  res.status(200).json({
    message: "Book Updated Successfully",
  }); 
});

app.use(express.static("./storage/"))

app.listen(3000, () => {
  console.log("Server is running on port 3000");
}); 
