import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar';
import  {Camera} from '@ionic-native/camera/ngx'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireModule} from '@angular/fire';
import { config } from './cred';
import * as firebase from 'firebase/app';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { ViewhairstylePipe } from './viewhairstyle.pipe'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'
import { ModalPage } from './modal/modal.page';
import {CommonModule} from '@angular/common';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ReviewsPageModule } from './reviews/reviews.module';
import { ViewsalonPageModule } from './viewsalon/viewsalon.module';
import { IonicStorageModule,Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Device } from '@ionic-native/device/ngx';
import {CustomerPage} from '../app/customer/customer.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import {PicturePage} from '../app/picture/picture.page';

@NgModule({
  declarations: [AppComponent, ViewhairstylePipe,ModalPage,CustomerPage,PicturePage],
  entryComponents: [ModalPage],
  imports: [IonicStorageModule.forRoot() ,BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    CommonModule,
  AngularFireModule.initializeApp(config),
  AngularFireDatabaseModule,
  AngularFireAuthModule,
 AngularFirestoreModule],
  providers: [
    // StatusBar,
    SplashScreen,
    Camera,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
   ,
   Geolocation,
   NativeGeocoder,
   LocalNotifications,
   AndroidPermissions,
   Device,
   CallNumber
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
