import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    console.log('Login page is opened...');
  }

  submitForm(form: NgForm) {
    console.log(form);

    this.loadingCtrl.create({
      message: 'Login process...'
    })
    .then(loadEl => {
      loadEl.present();
      this.authService.loginUser(form.value.email, form.value.password)
        .subscribe(
          () => {
            loadEl.dismiss();
          },
          err => {
            loadEl.dismiss();
            console.log('$loginUser error hapenned: err> :', err);
          }
      );
    })
    .catch(err => {
      console.log('submitform() loadingCtrl err>: ', err);
    })
    
  }

}
