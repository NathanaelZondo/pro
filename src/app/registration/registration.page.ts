import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import * as firebase from 'firebase';
import { ControlsService } from '../controls.service';
import { config } from '../cred';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(public control:ControlsService) { 
    
  }

  ngOnInit() {
  
  }


  user:User =
{
  email :"",
password :""
}

fun(user:User)
{
console.log(user)
firebase.auth().createUserWithEmailAndPassword(user.email,user.password).then(result => {
  console.log("uid =",result.user.uid);
  
if(result.user.uid)
{
  this.control.Loading();
this.control.RegToast();

this.control.router.navigate(['login']);
}
else{
  
}
 

}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
 

}

signin()
{
this.control.router.navigate(['login']);  
}

}
