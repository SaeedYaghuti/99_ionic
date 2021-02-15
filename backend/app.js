const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const multer = require('multer');
const { clearImage } = require('./util/file');
// const postRoutes = require('./routes/posts');
// const authRoutes = require('./routes/auth');
const checkAuth = require('./middleware/check-auth');
const path = require('path');
const express_graphql = require('express-graphql');
const resolvers = require('./graphql/resolvers');
const graphqlSchema = require('./graphql/schema');

//NOTE 
// Home
// mongoose.connect('mongodb://localhost:27017/meanDB')
// SHOP
mongoose.connect("mongodb+srv://BreakTheCage:" + encodeURIComponent("MongoDBBreakTheCage2") + "@cluster0-3lun8.mongodb.net/graphql?retryWrites=true&w=majority")
  .then(() => {
    console.log('+ Connected to DB');
  }).catch(err => {
    console.log('X Failed to Connect to DB');
    console.log(err);
  })

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Images Upload and Download Requirement
app.use("/images", express.static(path.join("backend","images")));
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
      .split('.')[0] //remove everything after '.' to delete .jpg
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});
app.use(multer({ storage: storage }).single("image"));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  if(req.method === 'OPTIONS') {
    // prevent from error:GraphQL only supports GET and POST requests. 
    return res.sendStatus(200);
  }
  next();
});

//check if we have valid token in req or not; we got req.isAuth praramerer
app.use(checkAuth);

//Image Upload to server
app.put('/post-image', (req, res, next) => {
  console.log('@app.put(post-image) run...');
  //check authentication
  if(!req.isAuth) {
    throw new Error('You are not authenticated to Upload Image to server');
  }
  if(!req.file) { //if we don't have image file
    res.status(200).json({message: "File not provided!"});
  }
  if(req.body.oldImagePath) {
    clearImage(req.body.oldImagePath);
  }
  const imagePath = req.protocol + "://" + req.get('host') + "/images/" + req.file.filename; //req.file.path
  console.log('@app.put(post-image) imagePath>: ', imagePath); 
  return res.status(201).json({message: 'File Stored', imagePath: imagePath});
})

app.use('/graphql', express_graphql({
  schema: graphqlSchema,
  rootValue: resolvers,
  graphiql: true,
  formatError(err)  {
    console.log(`@GraphQLError() 
    err.messeage: ${err.message}> | 
    err.path: ${err.path} |
    err.originalError: ${err.originalError} |
    err.positions: ${err.positions} |
    err.stack: ${err.stack} 
    `);
    if(!err.originalError) {//whene err is generate by gql because of technical err like type
      console.log(`@formatError() TECHNICAL ERROR occured!`);
      return err;
    }
    const data = err.originalError.data;
    const code = err.originalError.code || 500;
    const message = err.message || 'An Error occurred.';
    return { message: message, status: code, data: data}
  }
}));


// app.use("/api/posts", postRoutes);
// app.use("/api/auth", authRoutes);


module.exports = app;
