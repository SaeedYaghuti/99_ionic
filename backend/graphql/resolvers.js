const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const validator  = require('validator');
const jwt = require('jsonwebtoken');
const { clearImage } = require('../util/file');

module.exports = {
    createUser: async function({userInput}, req) {
        console.log('GraphQL=> @createUser userInput> ', userInput);
        //Validate input data
        const errors = [];
        if(validator.isEmpty(userInput.name)) {
            errors.push({message: 'Please add your name!'});
        }
        if(!validator.isEmail(userInput.email)) {
            errors.push({message: 'Invalid email address!'})
        }
        if(
            validator.isEmpty(userInput.password) || 
            !validator.isLength(userInput.password, {min: 6})
        ) {
            errors.push({message: 'Password is too short!'});
        }
        if(errors.length > 0) {
            const err = new Error('Invalid Input! Please be carefull');
            err.data = errors;
            err.code = 422;
            throw err;
        }
        const existingUser = await User.findOne({email: userInput.email});
        if(existingUser) {
            const err = new Error('This Email exists already!');
            throw err;
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(userInput.password, salt);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hash
        });
        const createdUser = await user.save();
        const token = await jwt.sign(
            {email: user.email, userId: createdUser._id },
            'secrete-must-be-long',
            {expiresIn: "1h"}
        );
        console.log('token>: ', token);
        return { 
            user : {
                _id: createdUser._id.toString(),
                name: createdUser.name,
                email: createdUser.email,
                posts: []
            },
            authData: {
                expiresIn: 3600000, //1hr in millisecond,
                token: token
            }
        }
    },

    login: async function({email, password}) {
        const user = await User.findOne({email: email});
        console.log('User from Database: ', user);
        if(!user) {
            const err = new Error('User not found inside DB');
            err.code = 401;
            throw err;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual) {
            const err = new Error('Pasword is incorrect!');
            err.code = 401;
            throw err;
        }
        const token = await jwt.sign(
            {email: user.email, userId: user._id },
            'secrete-must-be-long',
            {expiresIn: "1h"}
        );
        return {
            userId: user._id,
            token: token,
            expiresIn: 3600000 //1hr in millisecond
        }; 
    },

    createPost: async function({postInput}, req) {
        console.log(`@createPost() 
            postInput.title: ${postInput.title}, 
            postInput.content: ${postInput.content},
            postInput.imagePath: ${postInput.imagePath}`);
        console.log("GraphQL=> @createPost req.isAuth>; ",req.isAuth);
        console.log("GraphQL=> @createPost postInput: req.userData.author>: ", req.userData);
        
        //if using GraphIQL (we don't have user data in req)
        // const authorId = '5df764f0423adf24e059e93f';

        //if using IONIC (we have user data inside req)
        //if user is not Authenticated (decided inside middleware auth-check)
        if(!req.isAuth) {
            const err = new Error('User is NOT Authenticated to create new post');
            err.code = 401;
            throw err;
        }
        const authorId = req.userData.author;

        //Validate input data
        const errors = [];
        if(
            validator.isEmpty(postInput.title) || 
            !validator.isLength(postInput.title, {min: 5})
        ) {
            errors.push({message: 'Title must be more than 5 character'});
        }
        if(
            validator.isEmpty(postInput.content) || 
            !validator.isLength(postInput.content, {min: 5})
        ) {
            errors.push({message: 'Content must be more than 5 character'});
        }
        if(
            validator.isEmpty(postInput.imagePath)
        ) {
            errors.push({message: 'imagePath should not be empty'});
        }

        if(errors.length > 0) {
            const err = new Error('Invalid Post Data! Please add valid data');
            err.data = errors;
            err.code = 422;
            throw err;
        }
        console.log(`@createPost() CONGRADULATION you are Authenticated User`);

        //get userdata from db by using req.userId
        const user = await User.findById(authorId);
        if(!user) {
            console.log(`@createPost() No user found with userId: ${authorId}`);
            const err = new Error(`No user found with userId: ${req.userData.author}`);
            err.code = 401;
            throw err;
        }

        // Create post with valid data
        const post = new Post({
            title: postInput.title,
            content: postInput.content,
            imagePath: postInput.imagePath,
            author: user._id
        })
        const createdPost = await post.save();

        //add created post to User at db
        user.posts.push(createdPost);
        await user.save();

        
        if(!createdPost) {
            const err = new Error('Error happend when adding your post to DB!');
            err.code = 422;
            throw err;
        }

        console.log("@createPost() Dear User: You Create Successfully Post in db createdPost>: ", createdPost);
        console.log("@createPost() Dear User: Your data in database is user>: ", user);

        return {
            _id: createdPost._id.toString(),
            title: createdPost.title,
            content: createdPost.content,
            imagePath: createdPost.imagePath.replace(/backend\\/g, ''),
            author: user
        }
    },

    fetchPosts: async function({page, postsPerPage}) {
        console.log("@fetchPosts page>; ",page);
        console.log("@fetchPosts=> postsPerPage>: ", postsPerPage);

        const postsCount = await Post.count(); // await Post.find().countDocuments();
        let posts;
        if(page > 0 && postsPerPage > 0) {
            posts = await Post.find()
                            .skip((page - 1)* postsPerPage)
                            .limit(postsPerPage)
                            // .sort({createdAt: -1})
                            .populate('author');
        } else {
            posts = await Post.find().populate('author');
        }

        // console.log("@fetchPosts postsCount>; ",postsCount);
        // console.log("@fetchPosts=> posts>: ", posts);

        //if there is no post: send err
        if(!posts) {
            console.log("@fetchPosts=> Error: There is no posts");
            const err = new Error('There is no POST inside DB');
            err.code = 401;
            throw err;
        }

        return {
            posts: posts
            .map(p => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    // createdAt: p.createdAt.toISOString(),
                    // updatedAt: p.updatedAt.toISOString(),
                    author: p.author
                }
            }),
            postsCount: postsCount
        }; 
    },

    editPost: async function({postInput}, req) {
        console.log(`@editPost() 
            postInput.id: ${postInput._id}, 
            postInput.title: ${postInput.title}, 
            postInput.content: ${postInput.content},
            postInput.imagePath: ${postInput.imagePath}`);
        console.log("GraphQL=> @editPost req.isAuth>; ",req.isAuth);
        console.log("GraphQL=> @editPost postInput: req.userData.author>: ", req.userData);
        
        //if using GraphIQL (we don't have user data in req)
        // const authorId = '5df764f0423adf24e059e93f';

        //if using IONIC (we have user data inside req)
        //if user is not Authenticated (decided inside middleware auth-check)
        if(!req.isAuth) {
            const err = new Error('User is NOT Authenticated to create new post');
            err.code = 401;
            throw err;
        }
        const authorId = req.userData.author;

        //Validate input data
        const errors = [];
        if(
            validator.isEmpty(postInput.title) || 
            !validator.isLength(postInput.title, {min: 5})
        ) {
            errors.push({message: 'Title must be more than 5 character'});
        }
        if(
            validator.isEmpty(postInput.content) || 
            !validator.isLength(postInput.content, {min: 5})
        ) {
            errors.push({message: 'Content must be more than 5 character'});
        }
        if(
            validator.isEmpty(postInput.imagePath)
        ) {
            errors.push({message: 'imagePath should not be empty'});
        }

        if(errors.length > 0) {
            const err = new Error('Invalid Post Data! Please add valid data');
            err.data = errors;
            err.code = 422;
            throw err;
        }
        console.log(`@editPost() CONGRADULATION you are Authenticated User`);

        //get userdata from db by using req.userId
        const user = await User.findById(authorId);
        if(!user) {
            console.log(`@editPost() No user found with userId: ${authorId}`);
            const err = new Error(`No user found with userId: ${req.userData.author}`);
            err.code = 401;
            throw err;
        }

        // find and update old post with _id
        const targetPost = await Post.findById(postInput._id);
        if(!targetPost) {
            console.log(`@editPost() No post found with postInput._id: ${postInput._id}`);
            const err = new Error(`No post found with postInput._id: ${postInput._id}`);
            err.code = 402;
            throw err;
        }

        //if client don't have Authority to make update post
        if(targetPost.author._id.toString() !== authorId) {
            console.log("@editPost() Failed Authorization targetPost.author._id.toString() !== authorId ", targetPost.author._id.toString(), authorId);
            const err = new Error(`You Dont have authority to Edit this Post! You can only edit YOUR posts`);
            err.code = 403;
            throw err;
        }

        targetPost.title = postInput.title;
        targetPost.content = postInput.content;
        targetPost.imagePath = postInput.imagePath;
        
        const updatedPost = await targetPost.save();

        //add created post to User at db
        user.posts.push(updatedPost); // we must find old post in User and replace with updatedPost
        await user.save();

        
        if(!updatedPost) {
            const err = new Error('Error happend when add your post to DB!');
            err.code = 422;
            throw err;
        }

        console.log("@editPost() Dear User: You Create Successfully Post in db updatedPost>: ", updatedPost);
        console.log("@editPost() Dear User: Your data in database is user>: ", user);

        return {
            _id: updatedPost._id.toString(),
            title: updatedPost.title,
            content: updatedPost.content,
            imagePath: updatedPost.imagePath,
            author: user
        }
    },

    deletePost: async function({postId}, req) {
        console.log(`@deletePost() postId: ${postId}`);
        console.log("GraphQL=> @deletePost req.isAuth>; ",req.isAuth);
        console.log("GraphQL=> @deletePost postInput: req.userData.author>: ", req.userData);
        
        //if using GraphIQL (we don't have user data in req)
        // const authorId = '5df764f0423adf24e059e93f';

        //if using IONIC (we have user data inside req)
        //if user is not Authenticated (decided inside middleware auth-check)
        if(!req.isAuth) {
            const err = new Error('User is NOT Authenticated to DELETE a post! Please login first');
            err.code = 401;
            throw err;
        }
        const authorId = req.userData.author;

        //Validate input data
        const errors = [];
        if(validator.isEmpty(postId) ) {
            errors.push({message: 'There is no Post Id to Delete'});
        }
        if(errors.length > 0) {
            const err = new Error('Invalid Post Id! Please add valid Id');
            err.data = errors;
            err.code = 422;
            throw err;
        }
        console.log(`@deletePost() CONGRADULATION you are Authenticated User`);

        //get userdata from db by using req.userId
        const user = await User.findById(authorId);
        if(!user) {
            console.log(`@deletePost() No user found with userId: ${authorId}`);
            const err = new Error(`No user found with userId: ${req.userData.author}`);
            err.code = 401;
            throw err;
        }

        // find and update old post with _id
        const post = await Post.findById(postId); //findById(postInput._id);
        if(!post) {
            console.log(`@deletePost() No post found with postId: ${postId}`);
            const err = new Error(`No post found with postId: ${postId}`);
            err.code = 402;
            throw err;
        }

        //if client don't have Authority to make update post
        if(post.author.toString() !== authorId) {
            console.log("@deletePost() Failed Authorization post.author.toString() !== authorId ", post.author.toString(), authorId);
            const err = new Error(` You Dont have authority to DELETE this Post`);
            err.code = 403;
            throw err;
        }

        //clear image related to post
        // C:\Users\User\Documents\SAEEDVIP\Udemy\Mean\Training\backend\http:\localhost:3000\images\img1-1576679885200.jpg
        clearImage(post.imagePath.split('3000')[1]);//TODO  http://loacalhost must be removed from imagePath

        try {
            await Post.findByIdAndRemove(postId);
            //delete the post from User.posts 
            user.posts.pull(postId);
            await user.save();
            return true;
        } catch (error) {
            console.log("@deletePost() Error Hapening when deleting Post error>: ", error)
            const err = new Error('Error hapende when Delete post from db!');
            err.code = 422;
            throw err;         
        }
    },


}
