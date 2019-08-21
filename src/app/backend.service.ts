import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
import { FirebaseAuth } from '@angular/fire';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import {AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
import { Profile } from './profile';
import { Observable } from 'rxjs/Observable';
import { ControlsService } from './controls.service';


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  itemsCollection:AngularFirestoreCollection<Profile>;
  items:Observable<any[]>;
  
  saloncollection:AngularFirestoreCollection<any>;
salons:Observable<any[]>;
  menstyles:Observable<unknown>;
  womenstyles:Observable<unknown>;
  constructor(public afs:AngularFirestore,public control:ControlsService) {

    this.items=this.afs.collection('userprofile').valueChanges();

    this.salons=this.afs.collection('Salons').valueChanges();

    this.menstyles = this.afs.collection('Salons').doc('sRkAEe3vxX5d7LR8WnhW').collection('Styles').doc('Men').valueChanges();

   this.womenstyles=this.afs.collection('Salons').doc('sRkAEe3vxX5d7LR8WnhW').collection('Styles').doc('women').valueChanges()
    console.log()
   }

getProfile()
{
  return this.items;
}

createprofile(profile:Profile)
{
 this.afs.collection('userprofile').doc(firebase.auth().currentUser.uid).set(profile); 
}

signout()
{
  firebase.auth().signOut()
}

authstate()
{
 if(firebase.auth().onAuthStateChanged)
 {
   this.control.router.navigate(['home'])
 }
 else{
  this.control.router.navigate(['login'])
 }

 console.log(firebase.auth().onAuthStateChanged)
}

 getsalons()
{
return this.salons;
}

getstyles()
{

 return this.menstyles; 


}
}

