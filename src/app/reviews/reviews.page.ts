import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
import { async } from '@angular/core/testing';
import { BackendService } from '../backend.service';


@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  SalonNode = {
    salonName: '',
    salonImage: '',
    salonLogo: '',
    location: '',
    numHairDressers: '',
    SalonDesc: '',
    SalonContactNo: '',
    userUID: '',
    coords: {lat:0,lng:0},
    streetName : ''

  }
  Profile = {
    name : '',
    image : ''
  }
  reviews = [];
  db = firebase.firestore();
  constructor(public alertController: AlertController,public loadingController: LoadingController,public backend:BackendService) { this.getSalon();  this.getProfile(); console.log('i think so');
   }

  ionViewDidLoad() {
    this.getSalon();
    this.getProfile();
    console.log('user uid', firebase.auth().currentUser.uid);
  }
ngOnInit(){}
  onRateChange(event){
    console.log(event);
  }
  async logRatingChange(rating){
    console.log("changed rating: ",rating);
      const alert = await this.alertController.create({
      header: 'What is your comment about '+this.backend.salonname+'?',
      inputs: [
        {
          name: 'comment',
          type: 'text',
          placeholder: 'Review'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'dark',
          handler: async () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async data => {
            console.log('Confirm Ok');
            this.db.collection('Salons').where("salonName", "==",this.backend.salonname).get().then(res =>{
              res.forEach(doc =>{
                this.db.collection('Salons').doc(doc.id).collection('ratings').doc(firebase.auth().currentUser.uid).set({
                  rating: rating,
                  review : data.comment,
                  name: this.Profile.name,
                  image : this.Profile.image
                })
              })
            })
          this.getSalon();
            const loading = await this.loadingController.create({
              message: 'Thank You ',
              duration: 1000
            });
            await loading.present();
          }
        }
      ]
    });

   await  alert.present();
  }

getSalon(){

  this.db.collection('Salons').where("salonName", "==",this.backend.salonname).onSnapshot(res =>{
    res.forEach(doc =>{
      this.db.collection('Salons').doc(doc.id).collection('ratings').onSnapshot(doc =>{
       doc.forEach(doc =>{
          
        this.reviews = []
        this.reviews.push(doc.data())
       })
      })
    })
  })
  // this.db.collection('Salons').where("salonName" , "==",this.backend.salonname).onSnapshot(res =>{
  //   if (res.empty !== true){
  //     console.log('Got data', res);
  //     res.forEach(doc => {
  //       console.log('data for salon ', doc.data())
       
  //       this.SalonNode.salonName = doc.data().salonName;
  //       let query =  this.db.collection('Salons').doc().collection('ratings');
  //       query.get().then( res =>{
  //         res.forEach(DOC =>{
  //           this.reviews = []
  //           this.reviews.push(DOC.data());

  //         })
  //       })
      
  //     })
  //   }
  // })
}
async getProfile(){
  const loading = await this.loadingController.create({
    message: 'getting you ready ',
    duration: 2000
  });
  await loading.present();
  this.db.collection('Users').where("uid","==", firebase.auth().currentUser.uid).get().then(res =>{
   res.forEach(doc =>{
    console.log('user profile',doc.data());
    
     this.db.collection('Users').doc(doc.id).onSnapshot(doc =>{
       this.Profile.image = doc.data().image;
       this.Profile.name = doc.data().name
     })
   })
  })
}
}
