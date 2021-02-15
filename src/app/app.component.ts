import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins, StatusBarStyle, } from '@capacitor/core';  
const { StatusBar,SplashScreen } = Plugins;
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //// capacitor
      // this.statusBar.styleDefault();
      // StatusBar.setStyle({style: StatusBarStyleDark})
      // this.splashScreen.hide();
      SplashScreen.hide();

      // cordova
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
    
  }
}
