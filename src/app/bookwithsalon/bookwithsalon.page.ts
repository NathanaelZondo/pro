import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import { bookings } from '../booking';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-bookwithsalon',
  templateUrl: './bookwithsalon.page.html',
  styleUrls: ['./bookwithsalon.page.scss'],
})
export class BookwithsalonPage implements OnInit {

  constructor(public backend:BackendService,public control:ControlsService) { }

  ngOnInit() {
    
  }
  booking:bookings ={
  name:this.backend.name,
  surname:this.backend.surname,
  cell:this.backend.cell,
  salonname:this.backend.salonname,
  salonlocation:this.backend.salonlocation,
  hairstyletype:this.backend.hairstyletype,
  hairstyleprice:this.backend.hairstyleprice,
  estimatedtime:this.backend.estimatedtime,
  sessiontime:this.backend.sessiontime
}



setbooking(booking:bookings)
{
  this.backend.userbookings(booking);
  this.control.router.navigate(['home']);
}

}
