import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostsPage } from './posts.page';
import { SharedModule } from '../shared/shared.module';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostCreatePageModule } from './post-create/post-create.module';
import { PostListPageModule } from './post-list/post-list.module';


@NgModule({
  declarations: [
    PostsPage,
    EditPostComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PostsRoutingModule,
    SharedModule,
    PostCreatePageModule,
    PostListPageModule
  ],
  entryComponents: [
    EditPostComponent
  ]
  
})
export class PostsPageModule {}
