import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import { ModalController, } from '@ionic/angular';
import * as firebase from 'firebase';
// import Swiper from 'swiper';

@Component({
  selector: 'app-viewsalon',
  templateUrl: './viewsalon.page.html',
  styleUrls: ['./viewsalon.page.scss'],
})
export class ViewsalonPage implements OnInit {
db = firebase.firestore();
  sliderConfig = {
    spaceBetween: 5,
    slidesPerView: 1.5
  }
likes;
total = 0;
rate = 0
dummy = []
userRating = []
  more = false;
  hair = [];
  viewhair = true;
  placeholder =this.backend.salonsDisply;
  aveg: number;
    constructor(public control:ControlsService,public backend:BackendService,public modalController: ModalController) {
    this.backend.getHairSalon();

    //this.gethairstyles(this.gend);

    console.log("selectedsalon data", this.salond)

    firebase.firestore().collection('salonAnalytics').doc(this.salond[0].userUID).collection('numbers').get().then(val=>{
      val.forEach(doc=>{
        console.log("These are the likes =",doc.data().likes);
        this.likes =doc.data().likes;
})})

   
    console.log(this.likes)

this.db.collection('SalonNode').doc(this.backend.salonname).collection('ratings').onSnapshot(snap =>{
snap.forEach( doc =>{
  this.userRating.push(doc.data().rating)
  console.log('users', doc.data().rating);
  /* this.userRating.forEach(cus =>{
    console.log('boring', cus);
    this.total+cus;
  //  this.total = rate + rate
  }) */
this.total += doc.data().rating;
console.log(this.total);
this.dummy.push(doc.data().rating)


})
this.aveg = this.total / this.dummy.length;
console.log('averge', this.aveg);

})
console.log('toatl for ratings',this.total)
  }
  salond = this.backend.selectedsalon;
  ngOnInit() {
  }
  gender = 0;
  selecthairstyle(x) {
    this.gender = x;
    this.gethairstyles(this.gender);

    //this.control.router.navigate(['viewhairstyle']);
    //this.control.router.navigate(['viewhairstyle']);

  }

  onViewDidEnter() {
    this.gethairstyles("female");
  }
  gethairstyles(x) {

    console.log(this.backend.salonname)

    let user = this.db.collection('SalonNode').doc(this.backend.salonname).collection('Styles')


    let query = user.where("genderOptions", "==", x).get().then(val => {
      val.forEach(doc => {

        this.hair.push(doc.data());
      })
    })

    console.log('jkl', this.hair)
  }

  choosehair(x) {
    console.log(x);
    this.backend.sethairstyledata(x.hairstyleName, x.duration, x.hairstylePrice);
    this.control.router.navigate(['bookwithsalon']);
  }

  viewHair() {
    this.more = !this.more
  }

  like(x)
  {
    console.log(x)
    let click = 1;
let v1;
let docid;

this.backend.salonuid =x.userUID;
firebase.firestore().collection('salonAnalytics').doc(x.userUID).collection('numbers').get().then(val=>{
  console.log("These are the numbers",val)
  val.forEach(qu=> 

    {
    docid =qu.id;
    console.log(docid)
    console.log(qu.data().likes)
    v1 =qu.data().likes;

    firebase.firestore().collection('salonAnalytics').doc(x.userUID).collection('numbers').doc(qu.id).update({"likes":v1+click}).then(zet=>{
      console.log(zet)
    })
  
  })
})
  }
}


  

