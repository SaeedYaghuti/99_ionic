import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';
import { Post } from '../01_blog/posts/post.model';
import { variable } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class KasabeService {
  private _posts = new BehaviorSubject<{posts: Post[], postsCount: number}>({posts: [], postsCount: 0});

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
    console.log('KasabeService-constructor is running...!')
    this.fetchMerchantTestQuery();
  }

  getKasabeUpdateListiner() {
    return this._posts.asObservable();
  }

  // http://localhost:3000/api/posts?page=1&postsPerPage=1
  fetchMerchantTestQuery() {
    console.warn('fetchMerchantTestQuery is running...!');
    
    this.loadingCtrl.create({
      message: 'Fetching kasabeTestQuery result From Server...'
    })
    .then(loadEl => {
      loadEl.present();
      this.http.post('http://localhost:3000/graphql', {
        query: 
          `query {
            kasabeTestQuery(message: "Hello Ionic"){
              message
            }
          }`,
      })
        .pipe(
          map( message => {
            console.log('fetched message>', message);
            return {
              line: 46,
              message: message
            }
          })
        )
        .subscribe(
            (message) => {
              console.log("fetched message from server successfuly: message>", message);
              this.alertCtrl.create({
                header: 'Message',
                subHeader: 'HttpResponce from server',
                message:  "Recived message: " + JSON.stringify(message),
                buttons: ['OK']
              })
              .then( alertEl => {
                  alertEl.present();
              });
              loadEl.dismiss();
            },
            err => {
              this.alertCtrl.create({
                header: 'Error Occourd',
                subHeader: 'HttpResponce from server',
                // message:  err.error.errors[0].message || err.message,
                message:  err,
                buttons: ['OK']
              })
              .then( alertEl => {
                alertEl.present();
              });
              console.log('fetching message from server err> :', err);
              loadEl.dismiss();
            }
        );
      })
      .catch(err => {
        console.log('fetchkasabeTestQuery loadingCtrl err>: ', err);
      }) 
  } //End fetchKasabe
  
  fetchMerchantTestQuery02() {
    console.warn('fetchMerchantTestQuery is running...!');
    
    this.loadingCtrl.create({
      message: 'Fetching kasabeTestQuery result From Server...'
    })
    .then(loadEl => {
      loadEl.present();
      this.http.post('http://localhost:3000/graphql', {
        query: 
          `query {
            kasabeSayHelloQuery
          }`,
        // variables?: {[key: string]: any}
      })
        .pipe(
          map( message => {
            console.log('fetched message>', message);
            return {
              line: 46,
              message: message
            }
          })
        )
        .subscribe(
            (message) => {
              console.log("fetched message from server successfuly: message>", message);
              this.alertCtrl.create({
                header: 'Message',
                subHeader: 'HttpResponce from server',
                message:  "Recived message: " + JSON.stringify(message),
                buttons: ['OK']
              })
              .then( alertEl => {
                  alertEl.present();
              });
              loadEl.dismiss();
            },
            err => {
              this.alertCtrl.create({
                header: 'Error Occourd',
                subHeader: 'HttpResponce from server',
                // message:  err.error.errors[0].message || err.message,
                message:  err,
                buttons: ['OK']
              })
              .then( alertEl => {
                alertEl.present();
              });
              console.log('fetching message from server err> :', err);
              loadEl.dismiss();
            }
        );
      })
      .catch(err => {
        console.log('fetchkasabeTestQuery loadingCtrl err>: ', err);
      }) 
  } //End fetchKasabe
  
  fetchMerchantTestQuery01() {
    console.warn('fetchMerchantTestQuery is running...!')

    //> first-try => Failed
    // const input = "Hello Query";
    // let kasabeTestQuery = `{"query": "kasabeSayHelloQuery"}`;
    // kasabeTestQuery = JSON.stringify(kasabeTestQuery);
    // let Url = 'http://localhost:3000/graphql';
    // console.log('<ksts> kasabeTestQuery json> ', kasabeTestQuery);

    //> second-try => Successfulle
    const url2 = 'http://localhost:3000/graphql?query={kasabeSayHelloQuery}';
    

    this.loadingCtrl.create({
      message: 'Fetching kasabeTestQuery result From Server...'
    })
    .then(loadEl => {
      loadEl.present();
      // this.http.post<{data:{ message: string }}>( Url, kasabeTestQuery )
      // this.http.post<{data:{ kasabeTestQuery: { message: string } }}>( Url, kasabeTestQuery )
      // this.http.post( Url, kasabeTestQuery )
      this.http.get(url2)
        .pipe(
          map( message => {
            console.log('fetched message>', message);
            return {
              line: 46,
              message: message
            }
          })
        )
        .subscribe(
            (message) => {
              console.log("fetched message from server successfuly: message>", message);
              this.alertCtrl.create({
                header: 'Message',
                subHeader: 'HttpResponce from server',
                message:  "Recived message: " + JSON.stringify(message),
                buttons: ['OK']
              })
              .then( alertEl => {
                  alertEl.present();
              });
              loadEl.dismiss();
            },
            err => {
              this.alertCtrl.create({
                header: 'Error Occourd',
                subHeader: 'HttpResponce from server',
                // message:  err.error.errors[0].message || err.message,
                message:  err,
                buttons: ['OK']
              })
              .then( alertEl => {
                alertEl.present();
              });
              console.log('fetching message from server err> :', err);
              loadEl.dismiss();
            }
        );
      })
      .catch(err => {
        console.log('fetchkasabeTestQuery loadingCtrl err>: ', err);
      }) 
  } //End fetchKasabe

  
  // http://localhost:3000/api/posts?page=1&postsPerPage=1
  merchantFetchById(merchant_id: number) {
    const graphqlQuery = {
      query: `
      query {
        fetchById(merchant_id: ${merchant_id}){
          merchant_id
          merchant_name
          contact_name
          contact_title
          logo
          note
          our_id
          url
          person_id
          person {
            person_id
            person_role
            person_name
          }
        }        
      }      
      `
    }
    const url = 'http://localhost:3000/graphql';

    this.loadingCtrl.create({
      message: 'Fetching Kasabe From Server...'
    })
    .then(loadEl => {
      loadEl.present();
      this.http.post<{data: { fetchById: any}}>(url, graphqlQuery)
        .pipe(
          map((result) => {
            console.log('merchantFetchById result ', result);
            return result.data.fetchById;
          })
        )
        .subscribe(
            (merchant: any) => {
              // this._posts.next(postsData)
              loadEl.dismiss();
            },
            err => {
              loadEl.dismiss();
              console.log('merchantFetchById error hapenned: err> :', err);
            }
        );
      })
      .catch(err => {
        console.log('merchantFetchById() loadingCtrl err>: ', err);
      }) 
  } //End fetchKasabe
  
  fetchKasabe(page: number, postsPerPage: number) {
    const graphqlQuery = {
      query: `
      query {
        fetchKasabe(page: ${page}, postsPerPage: ${postsPerPage}) {
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
      message: 'Fetching Kasabe From Server...'
    })
    .then(loadEl => {
      loadEl.present();
      this.http.post<{data:{fetchKasabe: {posts:Post[], postsCount: number}}}>('http://localhost:3000/graphql', graphqlQuery)
        .pipe(
          map((result: {data:{fetchKasabe: {posts:Post[], postsCount: number}}}) => {
            const posts = result.data.fetchKasabe.posts;
            console.log('GET result ', result);
            return {
              posts: posts.map(p => new Post(p._id, p.title, p.content, null, p.imagePath, p.author)),
              postsCount: result.data.fetchKasabe.postsCount
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
        console.log('fetchKasabe() loadingCtrl err>: ', err);
      }) 
  } //End fetchKasabe

  getPost(postId: string) {
    return this.getKasabeUpdateListiner().pipe(
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
        //{data: {fetchKasabe: {_id: string,title: string, content: string,imagePath: string, 
        //author:{_id: string} } }
        return this.http.post<{data: {createPost: any}, errors:[{message: string, status: number}]}> ("http://localhost:3000/graphql", graphqlQuery)
      })//SwitchMap End
      ,tap(createPostResult => {
        console.log('@addPost() post gql result>: ',createPostResult);
        if(!createPostResult.errors) {
          this.fetchKasabe(-1, -1);
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
            this.fetchKasabe(-1, -1);
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
            this.fetchKasabe(-1, -1);
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
            this.fetchKasabe(-1, -1);
          }
        })
      );
  }

}

}
