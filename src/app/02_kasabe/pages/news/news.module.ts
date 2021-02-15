import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewsPage } from './news';


@NgModule({
  declarations: [
    NewsPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  
})
export class NewsPageModule {}
