const express = require('express');
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');
const routes = express.Router();

//Images Upload and Download Requirement
const multer = require('multer');
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

routes.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: req.protocol + "://" + req.get('host') + "/images/" + req.file.filename,
      author: req.userData.author
    });
    console.log('B add new post  post>: ', post);
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        postId: createdPost._id,
        post: {
          _id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
          author: createdPost.author
        }
      });
    });
  }
);

//entrance => '/api/posts'
// http://localhost:3000/api/posts?page=1&postsPerPage=1
routes.get("", (req, res, next) => {
    const page = +req.query.page;
    const postsPerPage = +req.query.postsPerPage;
    let findQuery = Post.find();
    if(page && postsPerPage) {
      findQuery
        .skip((page - 1)* postsPerPage)
        .limit(postsPerPage);
    }
    Post.count().then(count => {
      findQuery.then(doc => {
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: doc,
          postsCount: count
        });
      })
    });
    
    
  });
  
  
  routes.put(
    "",
    checkAuth,
    multer({storage: storage}).single('image'),
    (req, res, next) => {
      const updatedPost = {
        _id: req.body._id,
        title: req.body.title,
        content: req.body.content,
        imagePath: req.body.imagePath,
        author: req.userData.author
      }
      if(req.file) {//we got new image => we must create new imagePath
        updatedPost.imagePath = req.protocol + "://" + req.get('host') + "/images/" + req.file.filename;
      }
      console.log('recived updatedPost: ', updatedPost);
    //post inside req.body must contain _id instead of id
    Post.updateOne({_id: updatedPost._id, author: updatedPost.author}, updatedPost).then(updateResult => {
      if(updateResult.nModified > 0) { // successfully
        res.status(201).json({
          message: 'Post UPDATED successfully',
          post: updatedPost
        });
      }else { // failed because client is unauthorized
        res.status(401).json({
          message: 'Post UPDATED faile because you are unAuthorized'
        });
      }
      console.log('update result: ', updateResult);
    }).catch(err => {
      console.log('(X) Server err in PUT: ', err);
    })
  });
  
  routes.delete("/:_id", checkAuth, (req, res, next) => {
    if(!req.params._id) {
      return res.status(401).json({
        message: 'for deleteng post you must add ID'
      });
    }
    Post.deleteOne({_id: req.params._id, author: req.userData.author})
      .then(deleteResult => {
        if(deleteResult.n > 0) {
          res.status(201).json({
            message: 'Post DELETED successfully'
          });
        }else {
          res.status(401).json({
            message: 'Post DELETED Failed because you are not authorized'
          });
        }
        
      })
      .catch(err => {
        console.log('DELETE err>: ', err);
      })

  });
  
  module.exports = routes;