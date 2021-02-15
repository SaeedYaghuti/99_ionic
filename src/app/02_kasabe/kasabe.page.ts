import { Component, OnInit, OnDestroy } from '@angular/core';
import { KasabeService } from './kasabe.service';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { Post } from '../01_blog/posts/post.model';

@Component({
  selector: 'app-kasabe',
  templateUrl: './kasabe.page.html',
  styleUrls: ['./kasabe.page.scss'],
})
export class KasabePage implements OnInit, OnDestroy {
  private posts: Post[];
  private kasabeSub: Subscription;
  private authSub: Subscription;
  private isAuthenticated = false;

  constructor(
    private kasabeSer: KasabeService,
    private loadongCtrl: LoadingController,
    private authSer: AuthService
  ) { }

  ngOnInit() {
    console.log('<|>KasabePage is running...')
    this.kasabeSub = this.kasabeSer.getKasabeUpdateListiner().subscribe((kasabeData) => {
      this.posts = kasabeData.posts;
    })
    this.authSub = this.authSer.getTokenListener().subscribe(token => {
      if(token) {
        this.isAuthenticated = true;
      }else{
        this.isAuthenticated = false;
      }

      //$ should remove this line
      this.isAuthenticated = true;
    });
    
    //$ uncomment auth
    // this.authSer.autoAuthByLocalData();
  }

  onLogout() {
    this.authSer.logout();
  }

  ngOnDestroy() {
    if(this.kasabeSub) this.kasabeSub.unsubscribe();
    if(this.authSub) this.authSub.unsubscribe();
  }

}
