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
  salondisp = [];
  profiles = [];
  constructor(public toastController:ToastController,public navCtrl:NavController,public afs: AngularFirestore, public control: ControlsService, public loadingController: LoadingController, ) {
  
 
    this.getsalons(); 
    


  }
  timeList: Array<{}>

  userId;
  
  uid;
  gend;
  type = 'chiskop;'
 

  bookingdata:bookings;
  refresh()
  {
    this.profiles=[];
  }
getbookingdata(booking:bookings)
{
  this.bookingdata =booking;
return booking;
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
    this.salondisp = [];
    this.db.collection('Salons').onSnapshot(snapshot => {
      snapshot.forEach(doc => {doc.data()
      console.log(doc.data())
      this.salondisp.push(doc.data())
      })
    })

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
genderOptions;
  sethairstyledata(name, duration, price,hairstyle,genderOptions)
   {
    this.hairstyletype = name;
    this.hairstyleprice = price;
    this.estimatedtime = duration;
    this.genderOptions=genderOptions;
this.hairstyleimage =hairstyle;
    console.log(name, duration, price);
  }
  username: string;
  name: string;
  surname: string;
  cell: string;
  salonname: string ;
  salonlocation: string;
  hairstyletype: string;
  hairstyleprice: string;
  estimatedtime: number;
  sessiontime: string;
  hairdresser: string;
  bookingdate: string;
staffnames =[];


  userbookings(booking: bookings) {
    console.log(booking)


    let click = 1;
    let v1;
    let docid;
     
  
    firebase.firestore().collection('Analytics').doc(booking.salonuid).get().then(val=>{

      console.log("numbers = ",val.data())
   
      firebase.firestore().collection('Analytics').doc(booking.salonuid).set({numberofviews:val.data().numberofviews,numberoflikes:val.data().numberoflikes,usercancel:val.data().usercancel,saloncancel:val.data().saloncancel,allbookings:val.data().allbookings+1,users:val.data().users});
    });



    this.afs.collection('Bookings').add(booking).then(result => {
      console.log(result)
    });

    console.log("query info =", booking.salonname, booking.hairdresser, booking.userdate, booking.hairdresser)
   

  }


  hairstyledata: Array<any> = [];






  gethairdresser() 
  {

    console.log("Salon uid =",this.salonuid)
    return this.db.collection('Salons').doc(this.salonuid).collection('staff').where("isAvialiabe", "==",true);
  }
  userbooking = [];

  getuserbookings()
   {
    this.userbooking = [];
    return this.db.collection('Bookings').where("useruid","==",this.uid).where("salonuid","==",this.salonuid);
  }
  

  bookingdetails =[];
  setbookingdetails(bd)
  {
    this.bookingdetails=[];
this.bookingdetails.push(bd);
}

  // async welcomeToast() 
  // {
  //   console.log(this.name)
  //   const toast = await this.toastController.create({
  //     message: 'Welcome back '+this.name+' '+this.surname,
  //     duration: 7000
  //   });
  //   toast.present();
  // }



  getHairSalon() {

  
    this.db.collection('Salons').get().then(snap => {
      if (snap.empty !== true) {

        snap.forEach(doc => {
          //console.log('Profile Document: ', doc.data())
          this.displayProfile = doc.data();
          this.name = doc.data().salonName;
          this.salonsDisply.push(doc.data())
console.log("Salon Display",this.salonsDisply)
          this.db.collection('Salons').doc(doc.data().salonName).collection('Styles').get().then(qu => {
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

    }).catch(err => {
      console.log("Query Results: ", err);

    })
  }
}





