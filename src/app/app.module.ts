import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import  {Camera} from '@ionic-native/camera/ngx'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireModule} from '@angular/fire';
import { config } from './cred';
import * as firebase from 'firebase';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { ViewhairstylePipe } from './viewhairstyle.pipe'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'
@NgModule({
  declarations: [AppComponent, ViewhairstylePipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  AngularFireModule.initializeApp(config),
  AngularFireDatabaseModule,
  AngularFireAuthModule,
 AngularFirestoreModule],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
   ,
   Geolocation,
   NativeGeocoder
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
