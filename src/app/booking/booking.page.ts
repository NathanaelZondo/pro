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
  ob ={};
   buttonactive ;
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
      console.log(doc.data());
     console.log(doc.data().surname,doc.data().hairdresser,doc.data().userdate,doc.data().salonname)
     

      console.log(currentdate)
  
      firebase.firestore().collection('SalonNode').doc(doc.data().salonname).collection('staff').doc(doc.data().hairdresser).collection(doc.data().userdate).where("surname","==",doc.data().surname).where("userdate","==",currentdate).get().then(val=>{
        val.forEach(val2=>{
          console.log(val2.data())
var obj ={id:val2.id}

console.log(console.log(obj))

      this.newdata.push( { ...obj ,... val2.data()})
            
console.log(this.newdata)
      });
      });


      });
    });

   


  
   }

  ngOnInit() {
    
  }



  cancel(x)
  {
console.log("USER Clicked",x);


x.status ="cancelled";
firebase.firestore().collection('SalonNode').doc(x.salonname).collection('staff').doc(x.hairdresser).collection(x.userdate).doc(x.id).update({
  status: 'cancelled'
}).then(res=>{
  console.log(res)
});

  }

}
