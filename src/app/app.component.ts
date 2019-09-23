import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar';
import { config } from './cred';
import { Router } from '@angular/router';
import {AngularFireModule} from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { BackendService } from './backend.service';
import { ControlsService } from './controls.service';

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
    // private statusBar: StatusBar,
    private router: Router,
    private backend:BackendService,
    private control:ControlsService
  ) {
    //firebase.initializeApp(config);
    AngularFireModule.initializeApp(config)

//this.control.router.resetConfig([{path: '', loadChildren: './navigation/navigation.module#NavigationPageModule'}]);

   this.afAuth.authState.subscribe(data => {
    console.log(data)
    
    this.backend.uid =data.uid;
    if(data)
    {

     
      firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).onSnapshot(val=>{
   
       console.log(val.data())
  
        if(val.data()==undefined)
        {
          this.control.navCtrl.setDirection('root');
          this.control.navCtrl.navigateRoot('/navigation');
        }
        else{
          this.backend.name = val.data().name;
          this.backend.surname = val.data().surname;
          this.backend.welcomeToast();
          this.control.navCtrl.setDirection('root');
          this.control.navCtrl.navigateRoot('/navigation');
        }  
      
      })
    
    }

    else{
      
      this.control.navCtrl.setDirection('root');
      this.control.navCtrl.navigateRoot('/login');
    }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  
}
