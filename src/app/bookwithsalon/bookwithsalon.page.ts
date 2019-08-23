import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import { bookings } from '../booking';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-bookwithsalon',
  templateUrl: './bookwithsalon.page.html',
  styleUrls: ['./bookwithsalon.page.scss'],
})
export class BookwithsalonPage implements OnInit {
  unit:string;
  unit1:string;
  constructor(public backend:BackendService,public control:ControlsService,public alertController:AlertController) {
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
  sessiontime:this.backend.sessiontime,
  sessionendtime:""
}
//this is the date inputed by the user
userdate;

//we need the mmaximum operating hours for the salon
salonoperatinghours =8;


blocker:boolean=false;
setbooking(booking:bookings)
{
  this.blocker =false;
  //this.backend.userbookings(booking);
// prevents incorrect dates from being selected
  if(new Date(this.userdate)<new Date(this.currentdate))
  {
   this.control.PastDateToast();
   this.blocker =true;
   console.log("pastdate")
  }
  else if(new Date(this.userdate)>new Date(this.futuredate))
  {
    this.control.FutureDateToast();
    this.blocker =true;
    console.log("futureDate")
  }
else {

  if(booking.sessiontime[0]=="0")
  {

//time estimated by the salon
let estimatedhours = parseInt((booking.estimatedtime/60).toString());
let estimatedmins =booking.estimatedtime%60;

console.log("look here",estimatedmins)



console.log("these are the estimated hours",estimatedhours)
let overlap =0;
//initial time variables
let hrs = parseFloat(this.booking.sessiontime[0]+this.booking.sessiontime[1]);
let mins =parseFloat(this.booking.sessiontime[3]+this.booking.sessiontime[4]);

console.log("Also look here",mins)
//new time variables
let newhrs;
let newmins;



if(mins+estimatedmins>59)
{
overlap =  mins+estimatedmins-60;

hrs= hrs+estimatedhours+1;
mins =overlap;
 
console.log("this is the converted time",hrs+":"+mins)
newhrs =parseFloat(this.booking.sessiontime[0]+this.booking.sessiontime[1]) +hrs;
newmins =mins;
if(newmins<10)
{
console.log("this is the converted time",newhrs+":0"+newmins)
booking.sessionendtime=newhrs+":0"+newmins;



}
else{
  console.log("this is the converted time",newhrs+":"+newmins)
  booking.sessionendtime=newhrs+":"+newmins;
  


}
}
else if(mins+estimatedmins<59){
  

  
  mins =mins+estimatedmins;
   
  console.log("this is the converted time",hrs+":"+mins)
  newhrs =parseFloat(hrs.toString())+estimatedhours;
  newmins =mins;
  if(newmins<10)
  {
  console.log("this is the converted time",newhrs+":0"+newmins)
  booking.sessionendtime=newhrs+":0"+newmins;

  
  }
  else{
    console.log("this is the converted time",newhrs+":"+newmins)
   
    booking.sessionendtime=newhrs+":"+newmins;
  }


}






  }
  else if(parseFloat(booking.sessiontime[0])>0)
  {
//time estimated by the salon
let estimatedhours = parseInt((booking.estimatedtime/60).toString());
let estimatedmins =booking.estimatedtime%60;

console.log("look here",estimatedmins)



console.log("these are the estimated hours",estimatedhours)
let overlap =0;
//initial time variables
let hrs = parseFloat(this.booking.sessiontime[0]+this.booking.sessiontime[1]);
let mins =parseFloat(this.booking.sessiontime[3]+this.booking.sessiontime[4]);

console.log("Also look here",mins)
//new time variables
let newhrs;
let newmins;



if(mins+estimatedmins>59)
{
overlap =  mins+estimatedmins-60;

hrs=hrs+ estimatedhours+1;
mins =overlap;
 
console.log("this is the converted time",hrs+":"+mins)
newhrs =parseFloat(this.booking.sessiontime[0]+this.booking.sessiontime[1]) +hrs;
newmins =mins;
if(newmins<10)
{
console.log("this is the converted time",newhrs+":0"+newmins)
booking.sessionendtime=newhrs+":0"+newmins;
}
else{
  console.log("this is the converted time",newhrs+":"+newmins)
  booking.sessionendtime=newhrs+":"+newmins;
}
}
else if(mins+estimatedmins<59){
  

  
  mins =mins+estimatedmins;
   
  console.log("this is the converted time",hrs+":"+mins)
  newhrs =hrs+estimatedhours ;
  newmins =mins;
  if(newmins<10)
  {
  console.log("this is the converted time",newhrs+":0"+newmins)
  booking.sessionendtime=newhrs+":0"+newmins;
  }
  else{
    console.log("this is the converted time",newhrs+":"+newmins)
    booking.sessionendtime=newhrs+":"+newmins;
  }


}




  }
  
}


////////////////////////////////////////////validating booking sessions







/////////////////////////////////////////////////////////////////
if(this.blocker==false)
{
  
//this.presentAlertConfirm();
//this.booking =booking;
}
this.backend.userbookings(booking);
  //this.control.router.navigate(['home']);
}



async presentAlertConfirm() {
  const alert = await this.alertController.create({
    header: 'Please note!',
    message: 'Your booking is at '+this.booking.salonname+' hair salon in '+this.booking.salonlocation+'\n'+
    ' from '+this.booking.sessiontime+' until '+this.booking.sessionendtime+'.',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Confirm',
        handler: () => {
         
          //this.backend.userbookings(this.booking);
        //  this.control.router.navigate(['home']);
          //this.control.BookToast();
        }
      }
    ]
  });

  await alert.present();

}


testarray=[];
testbooking(booking)
{


  let hourRange = parseFloat(booking.sessiontime[0]+booking.sessiontime[1]);
let minuteRange =parseFloat(booking.sessiontime[3]+booking.sessiontime[4])
console.log((minuteRange));
this.backend.db.collection('SalonNode').doc('Nakanjani').collection('staff').doc('busi').collection('2019-8-23').get().then(val=>{
  val.forEach(doc=>{
   
   this.testarray.push(doc.data());
  
  })
  console.log(this.testarray)
})

for(let i =0;i<this.testarray.length;i++)
{
if(parseFloat(this.testarray[i].sessiontime[0]+this.testarray[i].sessiontime[1])==hourRange && parseFloat(this.testarray[i].sessiontime[3]+this.testarray[i].sessiontime[4])<minuteRange)
{
console.log("Got Something")
this.control.SlotToast();
}  
}
}

}
