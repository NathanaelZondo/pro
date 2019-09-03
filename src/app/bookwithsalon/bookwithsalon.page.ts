import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import { bookings } from '../booking';
import { AlertController,ModalController } from '@ionic/angular';
import * as firebase from 'firebase';
import { ModalPage } from '../modal/modal.page';
@Component({
  selector: 'app-bookwithsalon',
  templateUrl: './bookwithsalon.page.html',
  styleUrls: ['./bookwithsalon.page.scss'],
})
export class BookwithsalonPage implements OnInit {
  unit:string;
  unit1:string;
  staff =[];

  isvalidated = true;
  constructor(public backend:BackendService,public control:ControlsService,public alertController:AlertController,public modalController: ModalController) {
    let cdate =new Date();
    cdate.getFullYear();
    let cd1 =new Date();
    this.backend.timeList=[];
    this.testarray=[];
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
formodal:boolean =false;
  ngOnInit() {
    
  }
  booking:bookings ={
  name:this.backend.username,
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
  userdate:""
}
//this is the date inputed by the user
userdate;

//we need the mmaximum operating hours for the salon
salonoperatinghours =8;


blocker:boolean=false;
setbooking(booking:bookings)
{

console.log("This is the ==",booking)

this.testarray =[];
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
  console.log("this is the converted time",'0'+newhrs+":0"+newmins)
  booking.sessionendtime=newhrs+":0"+newmins;
if(newhrs<10)
{
  booking.sessionendtime="0"+newhrs+":0"+newmins;
}
  
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

if(booking.hairdresser=="")
{
  this.control.name();
}
else if(booking.userdate=="")
{
this.control.date();
}
else if(booking.sessiontime=="")
{
this.control.time();
}
else
{

  
  this.testbooking(booking)
  
 
  
  
}




/////////////////////////////////////////////////////////////////
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
          this.control.router.navigate(['success']);
          this.control.BookToast();
        }
      }
    ]
  });

  await alert.present();

}
////////////////////////////////////////////////////////////////////////////////////////////////////////
db =firebase.firestore();
testarray=[];
testbooking(booking)
{
 let hourRange = parseFloat(booking.sessiontime[0]+booking.sessiontime[1]);
let minuteRange =parseFloat(booking.sessiontime[3]+booking.sessiontime[4])
console.log("Test booking here",booking);
this.db.collection('SalonNode').doc(booking.salonname).collection('staff').doc(booking.hairdresser).collection(booking.userdate).get().then(val=>{
if(val.size==0)
{
  this.isvalidated =false;
  this.control.SlotToast2();
}
val.forEach(doc=>{
  this.testarray.push(doc.data());
  
  if(this.testarray)
  {
    this.findtime(booking);
  }
 
 });
 
});


this.testarray=[];
}



timeList:Array<{}> =[
  {
   message1:String, 
   start:Date,
   message2:String,
   End:Date, 

  }
];

d1:Date;
d2:Date;
d3:Date;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
findtime(booking)
{

  
  let hourRange = parseFloat(booking.sessiontime[0]+booking.sessiontime[1]);
let minuteRange =parseFloat(booking.sessiontime[3]+booking.sessiontime[4]);

this.d1 =new Date((booking.userdate+'T')+(booking.sessiontime));
this.d2 =new Date((booking.userdate+'T0')+(booking.sessionendtime));
this.d3 ;


//this.formodal=false;

console.log("TestArray = ",this.testarray)

for(let i =0;i<this.testarray.length;i++)
  {

    this.d1 =new Date((booking.userdate+'T')+(booking.sessiontime));
    
    this.d2 =new Date((this.testarray[i].userdate+'T')+(this.testarray[i].sessiontime));
    

    console.log("Second condition for end time =",(this.testarray[i].sessionendtime[0]))

    
    
   
    
      this.d3 =new Date((this.testarray[i].userdate+'T')+(this.testarray[i].sessionendtime));

     
    let d4 =new Date((booking.userdate+'T')+(booking.sessionendtime));
    

    console.log("session end time = ",d4)

let a ="From ";
let b =" until";
let x = this.d2;
let y =this.d3;




this.timeList.push({a,x,b,y});
 
this.formodal =false;

  console.log("Timelist =",this.timeList)
if(this.d2>=this.d1 && this.d1<=this.d3)
{

  this.events.push({
    title: this.testarray[i].hairstyletype,
    startTime: new Date(x),
    endTime: new Date(y),
    allDay: false
  })
  console.log(this.events);
  this.setevents(this.events);
  
this.formodal =true;

console.log("This is de cond = ",this.formodal)




if(this.formodal==true)
{
  this.isvalidated =true;
  this.backend.timeList =this.timeList;
  this.control.SlotToast();
// this.presentModal(); 
}

  
}

else
{
  this.isvalidated =false;
  this.control.SlotToast1();

}



}

   }



   async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage
    });
    return await modal.present();
  }


  eventSource;
  viewTitle;
  isToday: boolean;
  calendar = {
      mode: 'month',
      currentDate: new Date()
  }; // these are the variable used by the calendar.
  loadEvents() {
    this.eventSource = this.getevents();
    console.log(this.eventSource)
  }
  onViewTitleChanged(title) {
      this.viewTitle = title;
  }
  onEventSelected(event) {
      console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }
  changeMode(mode) {
      this.calendar.mode = mode;
  }
  today() {
      this.calendar.currentDate = new Date();
  }
  onTimeSelected(ev) {
      console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
          (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
 
          if(parseFloat((new Date(ev.selectedTime).getMonth()+1).toString())<10 )
          {
              this.booking.userdate =new Date(ev.selectedTime).getFullYear().toString()+"-0"+(new Date(ev.selectedTime).getMonth()+1).toString()+"-"+new Date(ev.selectedTime).getDate().toString();

               if(parseFloat(new Date(ev.selectedTime).getDate().toString())<10)
               {
                this.booking.userdate =new Date(ev.selectedTime).getFullYear().toString()+"-0"+(new Date(ev.selectedTime).getMonth()+1).toString()+"-0"+new Date(ev.selectedTime).getDate().toString();
              console.log(this.booking.userdate) 
              }
          }

          else
          {
           this.booking.userdate=new Date(ev.selectedTime).getFullYear().toString()+"-"+(new Date(ev.selectedTime).getMonth()+1).toString()+"-"+new Date(ev.selectedTime).getDate();
   
            if(parseFloat(new Date(ev.selectedTime).getDate().toString())<10)
            {
         this.booking.userdate =new Date(ev.selectedTime).getFullYear().toString()+"-"+(new Date(ev.selectedTime).getMonth()+1).toString()+"-0"+new Date(ev.selectedTime).getDate().toString();
           console.log(this.booking.userdate) 
           }

          }
        }
  onCurrentDateChanged(event:Date) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      event.setHours(0, 0, 0, 0);
      this.isToday = today.getTime() === event.getTime();
  }
  createRandomEvents() {
      var events = [];
      for (var i = 0; i < 50; i += 1) {
          var date = new Date();
          var eventType = Math.floor(Math.random() * 2);
          var startDay = Math.floor(Math.random() * 90) - 45;
          var endDay = Math.floor(Math.random() * 2) + startDay;
          var startTime;
          var endTime;
          if (eventType === 0) {
              startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
              if (endDay === startDay) {
                  endDay += 1;
              }
              endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
              events.push({
                  title: 'All Day - ' + i,
                  startTime: startTime,
                  endTime: endTime,
                  allDay: true
              });
          } else {
              var startMinute = Math.floor(Math.random() * 24 * 60);
              var endMinute = Math.floor(Math.random() * 180) + startMinute;
              startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
              endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
              events.push({
                  title: 'Event - ' + i,
                  startTime: startTime,
                  endTime: endTime,
                  allDay: false
              });
          }
      }
      return events;
  }
  onRangeChanged(ev) {
      console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }
  markDisabled = (date:Date) => {
      var current = new Date();
      current.setHours(0, 0, 0);
      return date < current;
  };

  events =[];



  submit(booking:bookings)
  {
   this.presentAlertConfirm()
    
   
  }

  getevents()
{
return this.events;
}


  setevents(setve)
{
this.events=setve;








this.loadEvents();
console.log(this.events)
}
}




