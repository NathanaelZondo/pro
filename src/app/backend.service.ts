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
import { bookings } from './booking';


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

    this.menstyles = this.afs.collection('Salons').doc('sRkAEe3vxX5d7LR8WnhW').collection('Styles').doc('gender').collection('male').doc('ESdvVuyYbccge3Au9Qlq').valueChanges();

  
   this.womenstyles=this.afs.collection('Salons').doc('sRkAEe3vxX5d7LR8WnhW').collection('Styles').doc('gender').collection('female').doc('AKVWEYRB3203GYtMfc3B').valueChanges();
    
   }

   gend;
   type ='chiskop;'

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

getstyles(x)
{
  this.gend =x;
if(x ==0)
{
  
 return this.menstyles; 
}
else{
  
  return this.womenstyles;
}
}

setuserdata(name,surname,cell)
{
this.name=name;
this.surname=surname;
this.cell =cell;  
if(name ==""||surname==""||cell<1000)
{
  this.control.router.navigate(['createprofile']);
}
else
{
  this.control.router.navigate(['home']);
  console.log("logged in user name",name)
}
}

setsalondata(name,location)
{
  this.salonname=name;
  this.salonlocation=location;

  console.log(name,location);
}

sethairstyledata(name,duration,price)
{
  this.hairstyletype=name;
 this.hairstyleprice=price;
 this.estimatedtime=duration; 
 console.log(name,duration,price);
}

name:string;
surname:string;
cell:string;
salonname:string;
salonlocation:string;
hairstyletype:string;
hairstyleprice:string;
estimatedtime:number;
sessiontime:number;



userbookings(booking:bookings)
{
console.log(booking)
this.afs.collection('userbookings').doc(firebase.auth().currentUser.uid); 

}
}

