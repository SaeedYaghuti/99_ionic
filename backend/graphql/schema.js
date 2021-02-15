const { buildSchema } = require('graphql');

module.exports  = buildSchema(`
    type Post {
        _id: ID
        title: String
        content: String
        imagePath: String
        author: User
    }

    type FetchPost {
        _id: ID
        title: String
        content: String
        imagePath: String
        author: User
    }

    type FetchPostsResult {
        posts: [FetchPost]
        postsCount: Int
    }

    type User {
        _id: ID
        name: String
        email: String
        posts: [Post]
    }

    type AuthData {
        userId: ID
        token: String!
        expiresIn: Int!
    }

    type CreateUserType {
        user: User
        authData: AuthData
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        imagePath: String!
    }

    input EditPostInputData {
        _id: ID!
        title: String!
        content: String!
        imagePath: String!
    }

    type RoutMutation {
        createUser(userInput: UserInputData): CreateUserType!
        createPost(postInput: PostInputData) : Post
        editPost(postInput: EditPostInputData) : Post
        deletePost(postId: ID!): Boolean
    }

    type RoutQuery {
        login(email: String!, password: String!): AuthData!
        fetchPosts(page: Int!, postsPerPage: Int!): FetchPostsResult!
    }

    schema {
        query: RoutQuery
        mutation: RoutMutation
    }
`);
