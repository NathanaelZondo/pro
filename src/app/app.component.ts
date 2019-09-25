import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar';
import { config } from './cred';
import { Router } from '@angular/router';
import {AngularFireModule} from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { BackendService } from './backend.service';
import { ControlsService } from './controls.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  signal_app_id: string = '5381c453-7474-4542-9a79-488e96dd363c'
  firebase_sender_id: string ='282915271246'
  constructor(
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private router: Router,
    private oneSignal: OneSignal,
    private backend:BackendService,
    private control:ControlsService,
    private alertCtrl: AlertController
  ) {
    //firebase.initializeApp(config);
    AngularFireModule.initializeApp(config)
  this.init();

   this.afAuth.authState.subscribe(data => {
    console.log(data)
    this.backend.uid =data.uid;
    if(data)
    {

     
      firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).onSnapshot(val=>{
   
       console.log(val.data())
  
        if(val.data()==undefined)
        {
          this.control.profileToast()
          this.control.navCtrl.setDirection('root');
          this.control.navCtrl.navigateRoot('/createprofile');
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

  init() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.splashScreen.hide();
  
      if (this.platform.is('cordova')) {
        this.setupPush();
      }
   
    });
  }
  
  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit('5381c453-7474-4542-9a79-488e96dd363c','282915271246');
 
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
 
    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });
 
    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      let additionalData = data.notification.payload.additionalData;
 
      this.showAlert('Notification opened', 'You already read this before', additionalData.task);
    });
 
    this.oneSignal.endInit();
  }
 
  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {
            // E.g: Navigate to a specific screen
          }
        }
      ]
    })
    alert.present();
  }
  
}
