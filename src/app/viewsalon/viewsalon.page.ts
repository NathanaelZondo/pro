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

  sliderConfig = {
    spaceBetween: 5,
    slidesPerView: 1.5
  }

  more = false;
  hair = [];
  viewhair = true;
  placeholder =this.backend.salonsDisply;
    constructor(public control:ControlsService,public backend:BackendService,public modalController: ModalController) {
    this.backend.getHairSalon();

    //this.gethairstyles(this.gend);

    console.log("selectedsalon data", this.salond)
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
  db = firebase.firestore();
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




}




