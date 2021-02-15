

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostsPage } from './posts.page';
import { AuthGuard } from '../../auth/auth.guard';

//! entrance => 'localhost:8100/posts/'
const routes: Routes = [
  {
    // path: '',
    path: '',
    component: PostsPage,
    children: [
      // { 
      //     path: '',
      //     pathMatch: 'full',
      //     loadChildren: './post-list/post-list.module#PostListPageModule' 
      // },
      { 
          path: '',
          pathMatch: 'full',
          loadChildren: () => import('./post-list/post-list.module').then(m => m.PostListPageModule) 
      },
      //$ shoul change to new version
      { 
          path: 'create',
          loadChildren: './post-create/post-create.module#PostCreatePageModule',
          canActivate: [AuthGuard] 
      },
      {
        path: 'edit/:id', 
        loadChildren: './post-create/post-create.module#PostCreatePageModule',
        canActivate: [AuthGuard] 
      }
        
    ]
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  
})
export class PostsRoutingModule {}
