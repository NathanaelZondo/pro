import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { User } from '../user';
import * as firebase from 'firebase';
import { FirebaseAuth } from 'angularfire2';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { ControlsService } from '../controls.service';
import { config } from '../cred';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  constructor(
    public backend:BackendService,
    public control:ControlsService,
    public alertCtrl:AlertController
    ) {
  
  }

user:User=
{
  email:"",
  password:""

}



  ionViewDidEnter() {
   this.control.Loading();
  }
  fun(user:User)
{
console.log(user)
firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(result => {
  console.log(result.user.uid,result.user.email,'user logged in');
  
  
  if(result.user.uid>"")
  {
    this.control.router.navigate(['createprofile']);
    
    this.control.LoginToast();
  
  
  }
{

}
}).catch((error) => {
  // Handle Errors here.
  let errorCode = error.code;
  let errorMessage = error.message;
  this.presentAlert();
 // ...
});

}


async presentAlert() {
  const alert = await this.alertCtrl.create({
    header: 'Error',
    subHeader: 'Login Error',
    message: 'Make sure credentials were inputed correctly.',
    buttons: ['OK']
  });
}

signup()
{
this.control.router.navigate(['registration']);  
}
}