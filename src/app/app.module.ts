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
import {HttpClientModule} from '@angular/common/http';
import { ModalPage } from './modal/modal.page';
import {CommonModule} from '@angular/common';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ReviewsPageModule } from './reviews/reviews.module';
import { ViewsalonPageModule } from './viewsalon/viewsalon.module';
import { OneSignal } from '@ionic-native/onesignal/ngx';
@NgModule({
  declarations: [AppComponent, ViewhairstylePipe,ModalPage],
  entryComponents: [ModalPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
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
   LocalNotifications
 
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
