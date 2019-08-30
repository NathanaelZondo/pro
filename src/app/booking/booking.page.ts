import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  userbooking=[];
  constructor(public backend:BackendService,public control:ControlsService) {
    this.backend.getuserbookings().get().then(val =>{
      val.forEach(doc =>{
      this.userbooking.push(doc.data())
      console.log(this.userbooking);
      })
    })
   
   }

  ngOnInit() {
    
  }

}
