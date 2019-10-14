import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar';
import { config } from './cred';
import { Router } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { BackendService } from './backend.service';
import { ControlsService } from './controls.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
//import * as fire from 'onesignal-node'

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
    private backend: BackendService,
    private control: ControlsService,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
  
  ) {
    //firebase.initializeApp(config);

    this.initializeApp();
    //this.control.router.resetConfig([{path: '', loadChildren: './navigation/navigation.module#NavigationPageModule'}]);

    this.afAuth.authState.subscribe(data => {
      console.log(data)

      this.backend.uid = data.uid;
      if (data) {

        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).onSnapshot(val => {
          console.log(val.data())
          if (val.data() == undefined) {
            this.control.navCtrl.setDirection('root');
            this.control.navCtrl.navigateRoot('/navigation');
          }
          else {
            this.backend.name = val.data().name;
            this.backend.surname = val.data().surname;
            this.backend.welcomeToast();
            this.control.navCtrl.setDirection('root');
            this.control.navCtrl.navigateRoot('/navigation');
          }
        })
      }

      else {

        this.control.navCtrl.setDirection('root');
        this.control.navCtrl.navigateRoot('/login');
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.backgroundColorByHexString('#1E1E1E');
      // this.statusBar.styleLightContent();
      this.splashScreen.hide();
      if (this.platform.is('cordova')) {
       this.setupPush();
      }
    });
    AngularFireModule.initializeApp(config)
  }

  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit('bf488b2e-b5d1-4e42-9aa5-8ce29e6320c8', '282915271246');

    this.oneSignal.getIds().then((res) => {

      console.log("OneSignal User ID:", res.userId);
      // (Output) OneSignal User ID: 270a35cd-4dda-4b3f-b04e-41d7463a2316    
    });

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
