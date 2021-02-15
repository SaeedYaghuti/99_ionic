import { Component } from '@angular/core';
import { NewsService } from './news.service';


// @IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
  providers: [NewsService]
})
export class NewsPage {
  newsList: any[];

  constructor(
    // public navCtrl: NavController,
    // public navParams: NavParams,
    // private loadingCtrl: LoadingController,
    public newsService: NewsService
  ) {}

  ngOnInit() {
    // let loader = this.loadingCtrl.create({
    //   content: 'please wait'
    // })
    // loader.present();
    // this.newsService.getNews()
    //   .subscribe((news: any) => {
    //     this.newsList = news;
    //     loader.dismiss();
    //   }, error => {
    //     loader.dismiss();
    //   })
  }

  // newsDetail(newsId) {
  //   this.navCtrl.push("NewsDetailPage", {
  //     newsId: newsId
  //   });
  // }

}
