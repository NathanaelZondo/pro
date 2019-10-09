import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import * as firebase from 'firebase';
import { OneSignal } from '@ionic-native/onesignal/ngx';
 import { Device } from '@ionic-native/device/ngx';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {
  private versionType:any;
  constructor(public control:ControlsService,public router:Router,public backend:BackendService,    private oneSignal: OneSignal,private device: Device) { 
this.versionType  = device.version;
console.log('version', this.versionType)
   }
profiles =[];
  ngOnInit() {
    console.log("id of the id",this.backend.userId);
    

    this.oneSignal.getIds().then((res)=>{
      console.log('Token ID', res.userId)
    
      
    });
    console.log("heloo bangani");
    // this.control.Loading2()
    this.profiles =[];
    firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).onSnapshot(val=>{
 
     console.log(val.data())

      if(val.data()==undefined)
      {
        this.control.profileToast()
        this.control.navCtrl.setDirection('root');
        this.control.navCtrl.navigateRoot('/createprofile');
      }
      else{
       this.profiles.push(val.data());


       this.backend.profiles =this.profiles;
       console.log("Profile data =",this.profiles)
      this.backend.setuserdata(this.profiles[0].name, this.profiles[0].surname, this.profiles[0].personalNumber)
      }  
    
    })




    

  }

 





//   home()
//   {
//   this.router.navigate([('home')]);  
//   }
//   map()
//   {

// this.router.navigate(['home']);
//   }

//   profile()
//   {

// this.router.navigate(['/viewprofile']);
//   }

//   bookings()
//   {

// this.router.navigate(['booking']);
//   }

//   info()
//   {

// this.router.navigate(['info']);
//   }

  signout() {
    this.backend.signout();
    this.control.router.navigate(['login']);
  }
 

}
