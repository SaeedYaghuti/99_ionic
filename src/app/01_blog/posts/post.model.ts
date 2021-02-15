
class Author {
    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public password: string,
        public posts: Post[],

    ){}
    
}

export class Post {
    constructor(
        public _id: string,
        public title: string,
        public content: string,
        public image: File,
        public imagePath: string,
        public author: Author
    ){}
    
}