import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import * as firebase from 'firebase';
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  aboutUs = true;
  disclaimer = true;
  terms = true;
  legal = true;
  analitics = [];
  analytics = true;
  constructor(public control: ControlsService) { }

  ngOnInit() {

    firebase.firestore().collection('userAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').get().then(val => {
      val.forEach(data => {
        console.log(data.data())
        this.analitics.push(data.data());
      })
    })

  }

 

  back() {
    this.control.navCtrl.setDirection('root');
    this.control.navCtrl.navigateRoot('/navigation');
  }

  getAbout() {
    this.aboutUs = !this.aboutUs
  }

  getdisclaimer() {
    this.disclaimer = !this.disclaimer
  }

  getterms() {
    this.terms = !this.terms
  }

  getlegal() {
    this.legal = !this.legal
  }
  getanalytics() {
    this.analytics = !this.analytics
  }


}
