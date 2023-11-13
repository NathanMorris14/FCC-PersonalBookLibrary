/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../models').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      const totalBooks = await Book.find({})
      if (!totalBooks) {
        res.send("No Books");
      } else {
        const formatData = totalBooks.map((data) => {
          return {
            title: data.title,
            _id: data._id,
            commentcount: data.comments.length,
          }
        })
        res.json(formatData);
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      if(!title) {
        res.send("missing required field title");
        return;
      } 
      const newBook = new Book({ 
        title: title, })
      try {
        const bookData = await newBook.save();
        console.log(bookData)
        res.json({ _id: bookData._id, title: bookData.title} );
      }
      catch (err) {
          res.json({ error: "could not post"})
        }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
        Book.deleteMany({}).then(data => {
          if (data) {
            return res.json("complete delete successful")
          } else {
            return res.json({error: 'error'})
          }
        })
        .catch(err => {
          return res.json({error: err})
        })
        console.log("Complete Delete Successful")
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;

      try {
        let singleBook = await Book.findById(bookid);
        if (!singleBook) return res.send("no book exists");

        res.send(singleBook);
      } catch (err) {
        res.send("error finding book")
      }
      // Book.findById(bookid).then(data => {
      //   if (!data) {
      //     return res.json('no book exists')
          
      //   } else {
      //     return res.json({
      //       title: data.title,
      //       _id: bookid,
      //       comments: data.comments,
      //       commentcount: data.commentcount

      //     })
      //   }
      // })
      // .catch(err => {
      //   return res.json('no book exists')
      // })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      try {
      //   if(!comment) return res.send("missing required field comment")
      //   let commentToAdd = {
      // $push: {comment},
      // $inc:{commentcound:1}}
      // const data = await Book.findOneAndUpdate(bookid, commentToAdd, {new: true});
      // if(!data) return res.send("no book exists")
      // else return data;
      const bookToAddComment = await Book.findById(bookid)
      if (!bookToAddComment) {return res.send('no book exists');}
      if (!comment) {return res.send("missing required field comment");}
      
      let addComment = await Book.findByIdAndUpdate(
        { _id: bookid },
        { $push: {comments: comment } },
        { new: true }
      );
        
      res.json({
        _id: addComment._id,
        title: addComment.title,
        commentcount: addComment.commentcount,
        comments: addComment.comments,
      });
          // bookToAddComment.comments += ", " + comment;
          // bookToAddComment.commentcount += 1;
          // bookToAddComment.save();
      //   return res.json(bookToAddComment);
      console.log("book comment saved")
      }
      
      catch {(err => {
        return res.json("error while trying to save new comment")
      })
      }

      //json res format same as .get
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      try {
        const selectedBook = await Book.findOne({_id: bookid})
        if (!selectedBook) {
          return res.send('no book exists');
        }
        await Book.deleteOne({selectedBook})
        console.log("book delete succesful")
        return res.send('delete successful')
        
      }
      catch{(err => {
        return res.json({error: err})
      })}
      //if successful response will be 'delete successful'
    });
  
};
