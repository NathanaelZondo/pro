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

  constructor(public backend:BackendService,public control:ControlsService) {
    let cdate =new Date();
    cdate.getFullYear();
    let cd1 =new Date();
    
    
    
    cdate.getDay();
  this.currentdate= (cdate.getFullYear()+"-"+(cd1.getMonth()+1)+"-"+cdate.getDate());


  this.futuredate = (cdate.getFullYear()+"-"+(cd1.getMonth()+1)+"-"+cdate.getDate());



  if(cdate.getDate()>28)
  {
    this.futuredate = (cdate.getFullYear()+"-"+(cd1.getMonth()+2)+"-"+((cdate.getDate()+7-31)));
    console.log("futuredate1", this.futuredate )
  
  }
  else
  {
    this.futuredate = (cdate.getFullYear()+"-"+(cd1.getMonth()+1)+"-"+(cdate.getDate()+7));
    console.log("futuredate2", this.futuredate )
  
  }
  

  console.log("futuredate", this.futuredate )
  this.dat =this.currentdate;
  console.log(this.dat)
   }
currentdate ;
futuredate;
dat:Date;
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
  //this.backend.userbookings(booking);

  if(new Date(this.userdate)<new Date(this.currentdate))
  {
   this.control.PastDateToast();
  }
  else if(new Date(this.userdate)>new Date(this.futuredate))
  {
    this.control.FutureDateToast();
  }

  //this.control.router.navigate(['home']);
}



userdate;



}
