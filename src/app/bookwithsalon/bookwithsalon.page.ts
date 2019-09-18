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

  item = true;
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
    
this.cdate();

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
  userdate:this.cdate(),
  status:"Active",
  status2:"Active",
  salonuid:this.backend.salonuid,
  hairstyleimage:this.backend.hairstyleimage
}
//this is the date inputed by the user
userdate;

//we need the mmaximum operating hours for the salon
salonoperatinghours =8;

isv:boolean =false
blocker:boolean=false;
setbooking(booking:bookings)
{

console.log("This is the ==",booking)

this.testarray =[];
  this.blocker =false;
  //this.backend.userbookings(booking);
// prevents incorrect dates from being selected

if(parseFloat(booking.sessiontime[0]+booking.sessiontime[1])<8 || parseFloat(booking.sessiontime[0]+booking.sessiontime[1])>18)
{
  this.TimeAlert();
  this.isvalidated =true;
 return 0;
}
else
if(parseFloat(booking.sessiontime[3]+booking.sessiontime[4])>0 && parseFloat(booking.sessiontime[3]+booking.sessiontime[4])<30 )
{

console.log("block =",parseFloat(booking.sessiontime[3]+booking.sessiontime[4]) )
this.control.BlockToast();
this.isvalidated =true;

}
else if(parseFloat(booking.sessiontime[3]+booking.sessiontime[4])>30 && parseFloat(booking.sessiontime[3]+booking.sessiontime[4])<=59)
{

  console.log("block2 =",parseFloat(booking.sessiontime[3]+booking.sessiontime[4]) )
  this.control.BlockToast();
  this.isvalidated =true;

}
else
  if(new Date(this.booking.userdate)<new Date(this.currentdate+'T08:00'))
  {
 console.log("pdate 1 =",new Date(this.booking.userdate));

    console.log("pdate 2 =",new Date(this.currentdate));
   this.control.PastDateToast();
   this.isvalidated =true;
  
console.log()

   console.log("pastdate")
  }
  else if(new Date(this.booking.userdate)>new Date(this.futuredate))
  {
    this.control.FutureDateToast();
    this.blocker =true;
    console.log("futureDate")
  }
else {

  if(booking.sessiontime)
  {

//time estimated by the salon
let estimatedhours = parseInt((booking.estimatedtime/60).toString());
let estimatedmins =booking.estimatedtime%60;




let overlap =0;
//initial time variables
let hrs = parseFloat(this.booking.sessiontime[0]+this.booking.sessiontime[1]);
let mins =parseFloat(this.booking.sessiontime[3]+this.booking.sessiontime[4]);


//new time variables
let newhrs;
let newmins;



newhrs = hrs +estimatedhours;
newmins = mins;

console.log("newmins = ",newmins)
console.log("newhrs = ",newhrs)

if(newmins == 0 && newhrs>=10 && booking.estimatedtime ==30)
  {
    newhrs ;
    booking.sessionendtime=newhrs+":30";
    console.log("Time 00 =", booking.sessionendtime)
  }
  else
  
  if(newmins == 30 && newhrs>=10 && booking.estimatedtime ==30)
  {
    newhrs =newhrs+1;
    booking.sessionendtime=newhrs+":00";
    console.log("Time 00 =", booking.sessionendtime)
  }
  else



if(newmins == 0 && newhrs<10 && booking.estimatedtime ==30)
  {
    newhrs ;
    booking.sessionendtime="0"+newhrs+":30";
    console.log("Time 00 =", booking.sessionendtime)
  }
  else
  
  if(newmins == 30 && newhrs<10 && booking.estimatedtime ==30)
  {
    newhrs =newhrs+1;
    booking.sessionendtime="0"+newhrs+":00";
    console.log("Time 00 =", booking.sessionendtime)
  }
  else

  if(newmins == 30 && newhrs>=10 && booking.estimatedtime ==30)
  {
    newhrs =newhrs+1;
    booking.sessionendtime=newhrs+":"+newmins;
    console.log("Time 000 =", booking.sessionendtime)
  }
  else

if(newhrs<10 && newmins == 0)
{
  booking.sessionendtime="0"+newhrs+":00";
  console.log("Time 1 =", booking.sessionendtime)

}
else
if(newhrs<10 && newmins == 30)
{
  booking.sessionendtime="0"+newhrs+":"+newmins;
  console.log("Time 2 =", booking.sessionendtime)

}
if(newhrs>=10 && newmins == 0 && booking.estimatedtime !=30)
{
  booking.sessionendtime=newhrs+":00";
  console.log("Time 11 =", booking.sessionendtime)

}
else
if(newhrs>=10 && newmins == 30 && booking.estimatedtime !=30)
{
  booking.sessionendtime=newhrs+":"+newmins;
  console.log("Time 22 =", booking.sessionendtime)

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
  this.control.Loading();  
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
let v1;
let click = 1;
          firebase.firestore().collection('salonAnalytics').doc(this.backend.salonuid).collection('numbers').get().then(val=>{
            console.log("These are the numbers",val)
            val.forEach(qu=> 
          
              {
            qu.id;
              console.log(qu.id)
              console.log(qu.data().numberofbookings)
              v1 =qu.data().numberofbookings;
          
              firebase.firestore().collection('salonAnalytics').doc(this.backend.salonuid).collection('numbers').doc(qu.id).update({"numberofbookings": v1+click}).then(zet=>{
                console.log(zet)
              })
              }
              
            
            )
          })
          


          firebase.firestore().collection('userAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').get().then(val=>{
            console.log("These are the numbers",val)
            val.forEach(qu=> 
          
              {
            qu.id;
              console.log(qu.id)
              console.log(qu.data().numberofbookings)
              v1 =qu.data().numberofbookings;
          
              firebase.firestore().collection('userAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').doc(qu.id).update({"numberofbookings": v1+click}).then(zet=>{
                console.log(zet)
              })
              }
              
            
            )
          })

          this.control.BookToast();
          this.control.navCtrl.navigateRoot('/success');
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
 
  this.events =[];
  this.testarray =[];
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
testarray2 =[];
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
findtime(booking)
{
this. events =[];
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
if(this.d2<=this.d1 && this.d1<this.d3)
{

this.formodal =true;
this.isvalidated =true;
this.control.SlotToast();
console.log("Booking Error slot occupied ")

}

else
{

  console.log(" d1 =",this.d1," d2 =",this.d2," d3= ",this.d3);
  console.log(this.d2>=this.d1 && this.d1<=this.d3)
  this.isvalidated =false;
  //this.control.SlotToast1();

}

this.db.collection('SalonNode').doc(booking.salonname).collection('staff').doc(booking.hairdresser).collection(booking.userdate).where("sessiontime","==",booking.sessiontime).get().then(val=>{
val.forEach(value=>{
  //console.log(value.data())
  if(value.data().sessiontime!="")
  {
    this.isvalidated =true;
    this.backend.timeList =this.timeList;
    this.control.SlotToast();
  }
  else{
    this.isvalidated =true;
    this.backend.timeList =this.timeList;
    this.control.SlotToast();
  }
})
})



this.db.collection('SalonNode').doc(booking.salonname).collection('staff').doc(booking.hairdresser).collection(booking.userdate).where("sessionendtime","==",booking.sessionendtime).get().then(val=>{
  val.forEach(value=>{
    console.log(value.data())
    if(value.data().sessiontime!="")
    {
      this.isvalidated =true;
      this.backend.timeList =this.timeList;
      this.control.SlotToast();
    }
    else{
      this.isvalidated =true;
      this.backend.timeList =this.timeList;
      this.control.SlotToast();
    }
  })
  })




  
 

 }



//  this.db.collection('SalonNode').doc(booking.salonname).collection('staff').doc(booking.hairdresser).collection(booking.userdate).onSnapshot(val=>{

//   val.forEach(doc=>{
  
//    this.testarray.push(doc.data());
//   });

  
//    this.testarray2 =this.testarray;
  
  
  
//     })
  this.testarray2 =this.testarray;
    console.log("TestArray2 = ",this.testarray2)

   
  
    for(let i =0;i<this.testarray2.length;i++)   {
  
       this.d1 =new Date((booking.userdate+'T')+(booking.sessiontime));
      
       this.d2 =new Date((this.testarray2[i].userdate+'T')+(this.testarray2[i].sessiontime));
      
  
     console.log("Second condition for end time =",(this.testarray2[i].sessionendtime[0]))
  
    
        this.d3 =new Date((this.testarray2[i].userdate+'T')+(this.testarray2[i].sessionendtime));
  
       
       let d4 =new Date((booking.userdate+'T')+(booking.sessionendtime));
      
  
  //     console.log("session end time = ",d4)
  
   let a ="From ";
   let b =" until";
   let x = this.d2;
   let y =this.d3;
  
  
   this.d1 =new Date((booking.userdate+'T')+(booking.sessiontime));
   this.d2 =new Date((booking.userdate+'T0')+(booking.sessionendtime));
   
  
  
   this.timeList.push({a,x,b,y});
   
   
  
     console.log("Timelist =",this.timeList)
  
  
     this.events.push({
       title: this.testarray2[i].hairstyletype,
       startTime: new Date(x),
       endTime: new Date(y),
       allDay: false
     })
     console.log("Events = ",this.events);
     this.setevents(this.events);
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

    if(booking.sessiontime)
    {
  
  //time estimated by the salon
  let estimatedhours = parseInt((booking.estimatedtime/60).toString());
  let estimatedmins =booking.estimatedtime%60;
  
  
  
  
  let overlap =0;
  //initial time variables
  let hrs = parseFloat(this.booking.sessiontime[0]+this.booking.sessiontime[1]);
  let mins =parseFloat(this.booking.sessiontime[3]+this.booking.sessiontime[4]);
  
  
  //new time variables
  let newhrs;
  let newmins;
  
  
  
  newhrs = hrs +estimatedhours;
  newmins = mins;
  
  console.log("newmins = ",newmins)
  console.log("newhrs = ",newhrs)
  
  if(newmins == 0 && newhrs>=10 && booking.estimatedtime ==30)
    {
      newhrs ;
      booking.sessionendtime=newhrs+":30";
      console.log("Time 00 =", booking.sessionendtime)
    }
    else
    
    if(newmins == 30 && newhrs>=10 && booking.estimatedtime ==30)
    {
      newhrs =newhrs+1;
      booking.sessionendtime=newhrs+":00";
      console.log("Time 00 =", booking.sessionendtime)
    }
    else
  
  
  
  if(newmins == 0 && newhrs<10 && booking.estimatedtime ==30)
    {
      newhrs ;
      booking.sessionendtime="0"+newhrs+":30";
      console.log("Time 00 =", booking.sessionendtime)
    }
    else
    
    if(newmins == 30 && newhrs<10 && booking.estimatedtime ==30)
    {
      newhrs =newhrs+1;
      booking.sessionendtime="0"+newhrs+":00";
      console.log("Time 00 =", booking.sessionendtime)
    }
    else
  
    if(newmins == 30 && newhrs>=10 && booking.estimatedtime ==30)
    {
      newhrs =newhrs+1;
      booking.sessionendtime=newhrs+":"+newmins;
      console.log("Time 000 =", booking.sessionendtime)
    }
    else
  
  if(newhrs<10 && newmins == 0)
  {
    booking.sessionendtime="0"+newhrs+":00";
    console.log("Time 1 =", booking.sessionendtime)
  
  }
  else
  if(newhrs<10 && newmins == 30)
  {
    booking.sessionendtime="0"+newhrs+":"+newmins;
    console.log("Time 2 =", booking.sessionendtime)
  
  }
  if(newhrs>=10 && newmins == 0 && booking.estimatedtime !=30)
  {
    booking.sessionendtime=newhrs+":00";
    console.log("Time 11 =", booking.sessionendtime)
  
  }
  else
  if(newhrs>=10 && newmins == 30 && booking.estimatedtime !=30)
  {
    booking.sessionendtime=newhrs+":"+newmins;
    console.log("Time 22 =", booking.sessionendtime)
  
  }
  
  
  
  
  
  
  }
  
  


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
////////////////////////////////////////////////////////////////

todate;
//Get current date
cdate()
{
  this.control.tip();
  this.todate = (new Date().getFullYear().toString())+'-'+(new Date().getMonth())+'-'+(new Date().getDate());
  if((new Date().getMonth()+1)<10)
  {

    this.todate = (new Date().getFullYear().toString())+'-0'+(new Date().getMonth()+1)+'-'+(new Date().getDate());
  if((new Date().getDate())<10)
  {
    this.todate = (new Date().getFullYear().toString())+'-0'+(new Date().getMonth()+1)+'-0'+(new Date().getDate());
  }

}
console.log("Currentdate =",this.todate)
return this.todate;
}

back()
{
  this.control.router.navigateByUrl('/viewsalon');
}







async TimeAlert() {
  const alert = await this.alertController.create({
    header: 'Alert',
    subHeader: 'Time constraints',
    message: 'You can only book from 08:00 until 18:00.',
    buttons: ['OK']
  });

  await alert.present();
}
}




