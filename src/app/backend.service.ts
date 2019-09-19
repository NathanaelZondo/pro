import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
import { FirebaseAuth, FirebaseDatabase } from '@angular/fire';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Profile } from './profile';
import { Observable } from 'rxjs/Observable';
import { ControlsService } from './controls.service';
import { bookings } from './booking';



@Injectable({
  providedIn: 'root'
})


export class BackendService {
  itemsCollection: AngularFirestoreCollection<Profile>;
  items: Observable<any[]>;
  db = firebase.firestore();
  saloncollection: AngularFirestoreCollection<any>;
  salons: Observable<any[]>;
  menstyles: Observable<unknown>;
  womenstyles: Observable<unknown>;
  displayProfile;
  salonsDisply = [];
  selectedsalon = [];
  salonplaceholder = [];
  constructor(public toastController:ToastController,public navCtrl:NavController,public afs: AngularFirestore, public control: ControlsService, public loadingController: LoadingController, ) {
  
    this.items = this.afs.collection('Users').valueChanges();

    this.salons = this.afs.collection('Salons').valueChanges();


  }
  timeList: Array<{}>

  
  
  uid;
  gend;
  type = 'chiskop;'
  profiles = [];

  getProfile() 
  {
    return this.items;
  }

  

  getprofile2() 
  {
    return this.db.collection('Users').doc(this.uid).get();
  }

 

  signout()
   {
    this.navCtrl.setDirection('root');
    this.navCtrl.navigateRoot('/login');
    firebase.auth().signOut()
  }



  getsalons() 
  {
    return this.salons;
  }

  getstyles(x) {
    this.gend = x;
    if (x == 0) {

      return this.menstyles;

    }
    else 
    {

  return this.womenstyles;

    }
  }

  salonuid;
  setuserdata(username, surname, cell)
   {
    this.username = username;
    this.surname = surname;
    this.cell = cell;
    }

  setsalondata(name, streetname) 
  {
    this.salonname = name;
    this.salonlocation = streetname;

    console.log(name, streetname);
  }

hairstyleimage;
  sethairstyledata(name, duration, price,hairstyle)
   {
    this.hairstyletype = name;
    this.hairstyleprice = price;
    this.estimatedtime = duration;
this.hairstyleimage =hairstyle;
    console.log(name, duration, price);
  }
  username: string;
  name: string;
  surname: string;
  cell: string;
  salonname: string = 'Nakanjani';
  salonlocation: string;
  hairstyletype: string;
  hairstyleprice: string;
  estimatedtime: number;
  sessiontime: string;
  hairdresser: string;
  bookingdate: string;



  userbookings(booking: bookings) {
    console.log(booking)


    this.afs.collection('Bookings').doc(this.uid).collection('userbookings').add(booking).then(result => {
      console.log(result)
    });

    console.log("query info =", booking.salonname, booking.hairdresser, booking.userdate, booking.hairdresser)
    this.db.collection('Salons').doc(booking.salonname).collection('staff').doc(booking.hairdresser).collection(booking.userdate).add(booking);

  }

  salondisp;
  hairstyledata: Array<any> = [];

  getHairSalon() {

    this.hairstyledata = [];
  
    this.db.collection('Salons').onSnapshot(snap => {
      if (snap.empty !== true) {

        snap.forEach(doc => {
  
          this.displayProfile = doc.data();
          this.name = doc.data().salonName;
          this.salonsDisply.push(doc.data())

          this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('Styles').onSnapshot(qu => {
            qu.forEach(doc => {
              this.hairstyledata.push(doc.data());

              this.hairstyledata.splice(1, 1);
              console.log(this.hairstyledata.length)
            })
          })

        })

      } else {
        console.log('No data');

      }

    })
  }



  gethairdresser() 
  {
    return this.db.collection('SalonNode').doc(this.salonname).collection('staff').where("status", "==",true)
  }
  userbooking = [];

  getuserbookings()
   {
    this.userbooking = [];
    return this.db.collection('Bookings').doc(this.uid).collection('userbookings');
  }
  

  bookingdetails =[];
  setbookingdetails(bd)
  {
    this.bookingdetails=[];
this.bookingdetails.push(bd);
}

  async welcomeToast() 
  {
    console.log(this.name)
    const toast = await this.toastController.create({
      message: 'Welcome back '+this.name+' '+this.surname,
      duration: 7000
    });
    toast.present();
  }

}





