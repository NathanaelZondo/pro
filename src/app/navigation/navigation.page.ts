import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import * as firebase from 'firebase';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  constructor(public control:ControlsService,public router:Router,public backend:BackendService) { }
profiles =[];
  ngOnInit() {

    this.control.Loading()
    this.profiles =[];
    firebase.firestore().collection('userprofile').doc(firebase.auth().currentUser.uid).onSnapshot(val=>{
 
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
      this.backend.setuserdata(this.profiles[0].name, this.profiles[0].surname, this.profiles[0].cell)
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
