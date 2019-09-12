import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import { ControlsService } from '../controls.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.page.html',
  styleUrls: ['./viewprofile.page.scss'],
})
export class ViewprofilePage implements OnInit {
  profiles = [];
  constructor(public backend: BackendService, public control: ControlsService) {
   
  }

  ngOnInit() {



firebase.firestore().collection('userprofile').doc(firebase.auth().currentUser.uid).onSnapshot(val=>{
 
this.profiles.push(val.data());
console.log(this.profiles)
this.profiles.splice(1,1);

})
  }


  update() {
    this.control.router.navigate(['updateprofile']);
  }

  signout() {
    this.backend.signout();
    this.control.router.navigate(['login']);
  }

  back() {
    this.control.router.navigate(['navigation']);
  }

}
