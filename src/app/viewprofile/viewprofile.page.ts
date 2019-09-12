import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import { ControlsService } from '../controls.service';
import * as firebase from 'firebase';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.page.html',
  styleUrls: ['./viewprofile.page.scss'],
})
export class ViewprofilePage implements OnInit {
  profiles = [];
  constructor(private navCtrl:NavController,public backend: BackendService, public control: ControlsService) {
    this.profiles =this.backend.profiles;
    console.log(this.profiles)
  }

  ngOnInit() {

   


  }


  update() {
    this.navCtrl.setDirection('root');
    this.navCtrl.navigateRoot('/updateprofile');
  }

  signout() {
    this.backend.signout();
    

  
    
    this.navCtrl.setDirection('root');
    this.navCtrl.navigateRoot('/login');
  }

  back() {
    this.navCtrl.setDirection('root');
    this.navCtrl.navigateRoot('/navigation');
  }

}
