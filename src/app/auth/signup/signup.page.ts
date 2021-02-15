import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signUpMode = true; 
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  submitForm(form: NgForm) {
    console.log('@submitForm() form> :', form);

    this.loadingCtrl.create({
      message: 'signup process...'
    })
    .then(loadEl => {
      loadEl.present();
      this.authService.signupNewUser(form.value.name, form.value.email, form.value.password)
        .subscribe(
            (signUpResult) => {
              loadEl.dismiss();
              if(signUpResult.errors) {
                this.alertCtrl.create({
                  message: signUpResult.errors[0].message
                }).then(alertEl => {
                  alertEl.present();
                })
              }else{
                form.reset();
                //! navigate 
                // this.navCtrl.navigateBack('/posts');
                this.navCtrl.navigateBack('/auth/login');
              }
            },
            (err) => {
              loadEl.dismiss();
              console.log('$signup-User error hapenned: err> :', err);
            }
        );
      })
      .catch(err => {
        console.log('submitform() loadingCtrl err>: ', err);
      })  
  }

  onSwitch() {
    this.signUpMode = ! this.signUpMode;
  }

}
