import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.page.html',
  styleUrls: ['./post-list.page.scss'],
})

// NOTE First page that load in App
export class PostListPage implements OnInit, OnDestroy {
  posts: Post[];
  postSub: Subscription;
  authSub: Subscription;
  isAuthenticated = false;
  userId: string;
  postsCount = 0;
  postsPerPage = 1;
  page = 0;
  constructor(
    private postSer: PostsService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    //Initioal data for App 
    this.postSub = this.postSer.getPostsUpdateListiner()
    .subscribe((postsData: {posts: Post[], postsCount: number})  => {
      this.posts = postsData.posts;
      this.postsCount = postsData.postsCount;
      console.log('recived post from DB: ', postsData);
    });
    this.authSub = this.authService.getTokenListener().subscribe(token => {
      if(token) {
        this.isAuthenticated = true;
        this.userId = this.authService.getUserId();
        console.log('@ngOnInit() userId>: ', this.userId);
      }else {
        this.isAuthenticated = false;
      }
    })
    //get only postsCount from database to use in changePageAutomatic()
    this.postSer.fetchPosts(-1, -1);
  }

  onDelete(postId: string) {
    let loadingEl;
    this.loadingCtrl
      .create({
        message: 'Deleting your post...'
      })
      .then(loadEl => {
        loadingEl = loadEl;
        loadEl.present();
        this.postSer.deletePost(postId)
        .subscribe(
            (deleteResult) => {
              loadEl.dismiss();
              if(deleteResult.errors) {
                this.alertCtrl.create({
                  message: deleteResult.errors[0].message
                }).then(alertEl => {
                  alertEl.present();
                })
              }
            },
            (err) => {
              loadEl.dismiss();
              console.log('$on-delete-post error hapenned: err> :', err);
            }
        );
      })
      .catch(err => {
        this.alertCtrl
          .create({
            message: 'Sorry there was a problem when Deleting Element. Please try again later!'
          })
          .then(alertEl => {
            loadingEl.dismiss();
            alertEl.present();
          })
      });
  }

  ngOnDestroy() {
    if(this.postSub) this.postSub.unsubscribe();
    if(this.authSub) this.authSub.unsubscribe();
  }

  //depricated
  openEditModal(postId: string) {
    const index = this.posts.findIndex(p => p._id === postId);
    let selectedPost = {...this.posts[index]};
    this.modalCtrl.create({
      component: EditPostComponent,
      componentProps: {post: selectedPost}
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(result => {
      if(result.role === 'confirm') {
        this.posts[index] = result.data.post;
        this.loadingCtrl.create({
          message: 'Updating your post...'
        }).then(loadEl => {
          loadEl.present();
          console.log('! post-list=> sent data to service ',result.data.post);
          
          this.postSer.editPost(result.data.post).subscribe(
            (editPostResult) => {
              loadEl.dismiss();
              if(editPostResult.errors) {
                this.alertCtrl.create({
                  message: editPostResult.errors[0].message
                }).then(alertEl => {
                  alertEl.present();
                });
              }
            },
            (err) => {
              console.log('! post-list => ',err);
              loadEl.dismiss();
            })
        });
      }
    })
  }

}
