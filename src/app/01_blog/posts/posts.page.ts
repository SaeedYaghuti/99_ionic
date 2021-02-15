import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from './posts.service';
import { Post } from './post.model';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit, OnDestroy {
  private posts: Post[];
  private postsSub: Subscription;
  private authSub: Subscription;
  private isAuthenticated = false;

  constructor(
    private postsSer: PostsService,
    private loadongCtrl: LoadingController,
    private authSer: AuthService
  ) { }

  ngOnInit() {
    this.postsSub = this.postsSer.getPostsUpdateListiner().subscribe((postsData: {posts: Post[], postsCount: number}) => {
      this.posts = postsData.posts;
    })
    this.authSub = this.authSer.getTokenListener().subscribe(token => {
      if(token) {
        this.isAuthenticated = true;
      }else{
        this.isAuthenticated = false;
      }
    });
    
    //! uncomment Auth
    // this.authSer.autoAuthByLocalData();
  }

  onLogout() {
    this.authSer.logout();
  }

  ngOnDestroy() {
    if(this.postsSub) this.postsSub.unsubscribe();
    if(this.authSub) this.authSub.unsubscribe();
  }

}
