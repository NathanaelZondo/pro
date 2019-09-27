import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import { bookings } from '../booking';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {

  constructor(public control:ControlsService,public backend:BackendService,public toastController:ToastController) { }

  ngOnInit() {
  }
  booking:bookings = this.backend.bookingdata;
    name="";
    surname ="";

val2 =false;
     
  pickdates() {
console.log()
if(this.val ==false)
{
  this.backend.username =this.name;
     this.backend.surname= this.surname;
  
if(this.name =="" || this.surname =="")
{
  this.error();

}
else{

  this.control.router.navigate(['dates']);
}

}

else if(this.val ==true)
{
  this.control.router.navigate(['dates']);
}


  }
val:boolean =true;
  otherdata()
  {
    console.log("clicked")
    this.val = false;
  }

  change()
  {
    this.val =true;
  }


  
async error()
{
  const toast = await this.toastController.create({
    message: 'Enter the name and surname.',
    duration: 5000
  });
  toast.present();

}
}
