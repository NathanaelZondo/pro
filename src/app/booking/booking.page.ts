import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  userbooking=[];
   low = false;
   surname;
   userdate;
   hairdresser;
   salonname;
   useruid;
  newdata =[];
  constructor(public backend:BackendService,public control:ControlsService) {
    let currentdate = (new Date().getFullYear().toString())+'-'+(new Date().getMonth())+'-'+(new Date().getDate());
    if((new Date().getMonth()+1)<10)
    {

      currentdate = (new Date().getFullYear().toString())+'-0'+(new Date().getMonth()+1)+'-'+(new Date().getDate());
    if((new Date().getDate())<10)
    {
      currentdate = (new Date().getFullYear().toString())+'-0'+(new Date().getMonth()+1)+'-0'+(new Date().getDate());
    }
    }

    this.backend.getuserbookings().get().then(val =>{
      val.forEach(doc =>{
      this.userbooking.push(doc.data())
      //console.log(doc.data());
     
      this.surname =doc.data().surname;
      this.hairdresser =doc.data().hairdresser;
      this.userdate = doc.data().userdate;
      this.salonname =doc.data().salonname;
      console.log(this.surname,this.hairdresser,this.salonname,this.userdate)
  
      firebase.firestore().collection('SalonNode').doc(this.salonname).collection('staff').doc(this.hairdresser).collection(this.userdate).where("surname","==",this.surname).where("userdate","==",currentdate).get().then(val=>{
        val.forEach(val2=>{

       ( { ... val2 , ... val2.data()})
        
      });
      });


      });
    });

    console.log(this.surname,this.hairdresser,this.salonname,this.userdate)

    

  
   }

  ngOnInit() {
    
  }

}
