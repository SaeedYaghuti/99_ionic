import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';

//! entrance => 'localhost:8100/auth/'
const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      // {
      //   path: 'signup',
      //   loadChildren: './signup/signup.module#SignupPageModule' 
      // },
      {
        path: 'signup',
        loadChildren: () => {
          console.log('-> signup');
          return import('./signup/signup.module').then(m => m.SignupPageModule);
        }
      },
      // {
      //   path: 'login',
      //   loadChildren: './login/login.module#LoginPageModule' 
      // },
      {
        path: 'login',
        loadChildren: () => {
          console.log('-> login');
          return import('./login/login.module').then(m => m.LoginPageModule);
        }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/auth/signup'
      },
    ]
  }
];

// const routes: Routes = [
//   {
//     path: '',
//     pathMatch: 'full',
//     redirectTo: '/auth/signup'
//   },
//   {
//     path: '',
//     component: AuthPage,
//     children: [
//       // {
//       //   path: 'signup',
//       //   loadChildren: './signup/signup.module#SignupPageModule' 
//       // },
//       {
//         path: 'signup',
//         loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
//       },
//       // {
//       //   path: 'login',
//       //   loadChildren: './login/login.module#LoginPageModule' 
//       // },
//       {
//         path: 'login',
//         loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
//       },
//     ]
//   }
// ];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ], 
  exports: [ RouterModule ]
})
export class AuthRoutingModule { }
