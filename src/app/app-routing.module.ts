import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

//! entrance=> localhost:8100/

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'kasabe'
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./02_kasabe/tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  // {
  //   path: 'kasabe',
  //   loadChildren: () => import('./02_kasabe/tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  {
    path: 'kasabe',
    loadChildren: () => {
      console.log('-> kasabe');
      return import('./02_kasabe/kasabe.module').then(m => m.KasabePageModule);
    }
  },
  {
    path: 'comments',
    loadChildren: () => {
      console.log('-> comments');
      return import('./02_kasabe/comments/comments.module').then( m => m.CommentsPageModule);
    }
  },
  // { path: 'posts', loadChildren: './01_blog/posts/posts.module#PostsPageModule' },
  {
    path: 'posts',
    loadChildren: () => {
      console.log('-> posts');
      return import('./01_blog/posts/posts.module').then( m => m.PostsPageModule);
    }
  },
  // { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  {
    path: 'auth',
    loadChildren: () => {
      console.log('-> auth');
      return import('./auth/auth.module').then( m => m.AuthPageModule);
    }
  },
  // { path: 'test', loadChildren: './test/test.module#TestPageModule' },
  {
    path: 'test',
    loadChildren: () => {
      console.log('-> test');
      return import('./test/test.module').then( m => m.TestPageModule);
    }
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
