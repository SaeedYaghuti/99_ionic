import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private _posts = new BehaviorSubject<{posts: Post[], postsCount: number}>({posts: [], postsCount: 0});

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) { }

  getPostsUpdateListiner() {
    return this._posts.asObservable();
  }

  // http://localhost:3000/api/posts?page=1&postsPerPage=1
  fetchPosts(page: number, postsPerPage: number) {
    const graphqlQuery = {
      query: `
      query {
        fetchPosts(page: ${page}, postsPerPage: ${postsPerPage}) {
          postsCount
          posts {
            _id
            title
            content
            imagePath
            author {
              _id
            }
          }
        }         
      }      
      `
    }
    let Url = 'http://localhost:3000/graphql';

    this.loadingCtrl.create({
      message: 'Fetching Posts From Server...'
    })
    .then(loadEl => {
      loadEl.present();
      this.http.post<{data:{fetchPosts: {posts:Post[], postsCount: number}}}>('http://localhost:3000/graphql', graphqlQuery)
        .pipe(
          map((result: {data:{fetchPosts: {posts:Post[], postsCount: number}}}) => {
            const posts = result.data.fetchPosts.posts;
            console.log('GET result ', result);
            return {
              posts: posts.map(p => new Post(p._id, p.title, p.content, null, p.imagePath, p.author)),
              postsCount: result.data.fetchPosts.postsCount
            }
          })
        )
        .subscribe(
            (postsData: {posts: Post[], postsCount: number}) => {
              this._posts.next(postsData)
              loadEl.dismiss();
            },
            err => {
              loadEl.dismiss();
              console.log('$fetching-posts-from-server error hapenned: err> :', err);
            }
        );
      })
      .catch(err => {
        console.log('fetchPosts() loadingCtrl err>: ', err);
      }) 
  } //End fetchPosts

  getPost(postId: string) {
    return this.getPostsUpdateListiner().pipe(
      take(1),
      map((postsData: {posts: Post[], postsCount: number}) => {
        return postsData.posts.find(p => p._id === postId);
      })
    )
  }

  addPost(post: Post) {
    console.log(`@addPost runing...`);
    const formData = new FormData();
    formData.append('image', post.image);
    //First upload image
    return this.http.put<{message: string, imagePath: string}>("http://localhost:3000/post-image", formData)
    .pipe(
      switchMap(putResult => {
        console.log('@addPost() http.put saved imageAddress>', putResult);
        console.log('@addPost() real recived imageAddress>', putResult.imagePath);
        console.log('@addPost() modified imageAddress>', putResult.imagePath.replace(/\\/g, '\\\\'));
        // True address for grapgQL : backend\\\\images\\\\whitebaby.jpg-1576651139489.jpg
        //putResult.imagePath
        const graphqlQuery = {query: `
          mutation {
            createPost(postInput: {
              title: "${post.title}", 
              content: "${post.content}",
              imagePath: "${putResult.imagePath.replace(/\\/g, '\\\\')}"
            }) {
              _id
              title
              content
              imagePath
              author {
                _id
                name
                email
                posts {
                  _id
                  title
                  content
                  imagePath
                }}}}`}
        //{data: {fetchPosts: {_id: string,title: string, content: string,imagePath: string, 
        //author:{_id: string} } }
        return this.http.post<{data: {createPost: any}, errors:[{message: string, status: number}]}> ("http://localhost:3000/graphql", graphqlQuery)
      })//SwitchMap End
      ,tap(createPostResult => {
        console.log('@addPost() post gql result>: ',createPostResult);
        if(!createPostResult.errors) {
          this.fetchPosts(-1, -1);
        }
      })
    );//End this.http.put() Subscribe
  }

  deletePost(postId: string) {
    const graphqlQuery = {
      query: `
        mutation {
          deletePost(postId: "${postId}")         
        }      
      `
    }
    //{data: {deletePost: boolean}, errors:[{message: string, status: number}]}
    return this.http.post<{data: {deletePost: boolean}, errors:[{message: string, status: number}]}>(`http://localhost:3000/graphql`, graphqlQuery)
      .pipe(
        tap(deleteResult => {
          console.log("@deletePost deleteResult> ", deleteResult);
          if(!deleteResult.errors) {
            this.fetchPosts(-1, -1);
          }
        })
      )
  }

  editPost(updatedPost: Post) {
    console.log("@editPost updatedPost> ", updatedPost);
    //NOTE  if newPost has File inside 'image' field the 'oldImagePath' is old and must be deleted inside server; 
    if(typeof(updatedPost.image) === 'object') {//change Image of post
      const formData = new FormData();
      formData.append('image', updatedPost.image);
      formData.append('oldImagePath', updatedPost.imagePath); //imagePath contain old image that must be removed from db
      //First upload image
      return this.http.put<{message: string, imagePath: string}>("http://localhost:3000/post-image", formData)
      .pipe(
        switchMap(putResult => {
          console.log('@editPost() http.put saved imageAddress>', putResult);
          console.log('@editPost() real recived imageAddress>', putResult.imagePath);
          console.log('@editPost() modified imageAddress>', putResult.imagePath.replace(/\\/g, '\\\\'));
          const graphqlQuery = {query: `mutation {
            editPost(postInput: {
              _id: "${updatedPost._id}",
              title: "${updatedPost.title}", 
              content: "${updatedPost.content}",
              imagePath: "${putResult.imagePath.replace(/\\/g, '\\\\')}"
            }) {
              _id
              title
              content
              imagePath
              author {
                _id
                name
                email
                posts {
                  _id
                  title
                  content
                  imagePath
            }}}}`}
          return this.http.post<{data: {editPost: any}, errors:[{message: string, status: number}]}>('http://localhost:3000/graphql', graphqlQuery)
        }),//switchMap end
        tap( updateImageResult => {
          if(!updateImageResult.errors) {
            this.fetchPosts(-1, -1);
          }
        })
      )//pipe 
    }else {//Only changing Text of post
      //NOTE  if newPost has no File inside 'image' field the imagePath is valid as before;
    const graphqlQuery = {query: `mutation {
        editPost(postInput: {
          _id: "${updatedPost._id}",
          title: "${updatedPost.title}", 
          content: "${updatedPost.content}",
          imagePath: "${updatedPost.imagePath.replace(/\\/g, '\\\\')}"
        }) {
          _id
          title
          content
          imagePath
          author {
            _id
            name
            email
            posts {
              _id
              title
              content
              imagePath
        }}}}`}
    return this.http.post<{data: {editPost: any}, errors:[{message: string, status: number}]}>('http://localhost:3000/graphql', graphqlQuery)
      .pipe(
        tap(updatePostResult => {
          if(!updatePostResult.errors) {
            this.fetchPosts(-1, -1);
          }
        })
      );
  }

}

}
