import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { config } from './cred';
import { Router } from '@angular/router';
import {AngularFireModule} from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    //firebase.initializeApp(config);
    AngularFireModule.initializeApp(config)
   // this.listenToAuth();

   this.afAuth.authState.subscribe(data => {
    console.log(data)
    if(data)
    {
    this.router.navigate(['navigation'])  
    }

    else{
      this.router.navigate(['login']) ; 
    }
    });


  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  listenToAuth() {
    if(firebase.auth().onAuthStateChanged)
    {
      this.router.navigateByUrl('/navigation');
    }
    else
    {
      this.router.navigateByUrl('/login');
    }
  }
}
