import { NgModule } from '@angular/core';
import { LoginPage } from './login';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  
})
export class LoginPageModule {}
