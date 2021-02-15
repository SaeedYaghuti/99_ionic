import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KasabePage } from './kasabe.page';
import { NewsPageModule } from './pages/news/news.module';

//! entrance => 'localhost:8100/kasabe/'

const routes: Routes = [
  {
    path: '',
    component: KasabePage,
    children: [
      // { 
      //     path: '',
      //     pathMatch: 'full',
      //     loadChildren: './post-list/post-list.module#PostListPageModule' 
      // },
      { 
          path: 'tabs',
          // pathMatch: 'full',
          loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) 
      },
      { 
          path: 'news',
          // pathMatch: 'full',
          loadChildren: () => import('./pages/news/news.module').then(m => m.NewsPageModule) 
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tabs',
      },
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
export class KasabeRoutingModule {}
