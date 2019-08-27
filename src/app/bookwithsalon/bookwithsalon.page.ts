import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import { bookings } from '../booking';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
@Component({
  selector: 'app-bookwithsalon',
  templateUrl: './bookwithsalon.page.html',
  styleUrls: ['./bookwithsalon.page.scss'],
})
export class BookwithsalonPage implements OnInit {
  unit:string;
  unit1:string;
  staff =[];
  constructor(public backend:BackendService,public control:ControlsService,public alertController:AlertController) {
    let cdate =new Date();
    cdate.getFullYear();
    let cd1 =new Date();
    
    this.backend.gethairdresser().get().then(val=>{
      val.forEach(stav=>{
        console.log(stav.data())
this.staff.push(stav.data());
      })
    })
    
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
  sessionendtime:"",
  hairdresser:"",
  userdate:undefined
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
  if(new Date(this.booking.userdate)<new Date(this.currentdate))
  {
   this.control.PastDateToast();
   this.blocker =true;
   console.log("pastdate")
  }
  else if(new Date(this.booking.userdate)>new Date(this.futuredate))
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
this.booking =booking;
}
//this.testbooking(booking);
//this.backend.userbookings(booking);
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
         
          this.backend.userbookings(this.booking);
          this.control.router.navigate(['home']);
          this.control.BookToast();
        }
      }
    ]
  });

  await alert.present();

}

db =firebase.firestore();
testarray=[];
testbooking(booking)
{
 let hourRange = parseFloat(booking.sessiontime[0]+booking.sessiontime[1]);
let minuteRange =parseFloat(booking.sessiontime[3]+booking.sessiontime[4])
console.log("Test booking here",booking);
this.db.collection('SalonNode').doc(booking.salonname).collection('staff').doc(booking.hairdresser).collection(booking.userdate).get().then(val=>{
val.forEach(doc=>{
  this.testarray.push(doc.data());
  if(this.testarray)
  {
    this.findtime(booking);
  }
 });
 
});



}


d1:Date;
d2:Date;
findtime(booking)
{

  console.log("This is the other booking",booking)
  let hourRange = parseFloat(booking.sessiontime[0]+booking.sessiontime[1]);
let minuteRange =parseFloat(booking.sessiontime[3]+booking.sessiontime[4]);

this.d1 =new Date((booking.userdate+'T')+(booking.sessiontime));
this.d2 =new Date((booking.userdate+'T0')+(booking.sessionendtime));




console.log("this is date 1 and 2",this.d1>this.d2)




for(let i =0;i<this.testarray.length;i++)
  {

console.log("For loop 1",this.d1>=new Date(booking.userdate+'T'+this.testarray[i].sessiontime) )

console.log("For loop 2",this.d2<=new Date(booking.userdate+'T0'+this.testarray[i].sessionendtime) )

if(this.d1.getHours()==new Date(booking.userdate+'T'+this.testarray[i].sessiontime).getHours() && this.d2<=new Date(booking.userdate+'T0'+this.testarray[i].sessionendtime) && this.d1)
{
  if(this.d1.getMinutes()<=this.d2.getMinutes())
  {
  this.control.SlotToast();
  }
}
  // if(parseFloat(this.testarray[i].sessiontime[0]+this.testarray[i].sessiontime[1])==hourRange)
  // {
  //   //console.log(this.testarray)
  // console.log("Got Something")
  // this.control.SlotToast();
  // }
  // else
  // {
  //   this.control.SlotToast();
  // }
   }
}

}