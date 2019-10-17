import { Component, OnInit, ɵConsole } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import { bookings } from '../booking';
import { AlertController, ModalController, LoadingController, PopoverController } from '@ionic/angular';
import * as firebase from 'firebase';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import {CustomerPage} from '../../app/customer/customer.page';
import {ZeroPage} from '../zero/zero.page'
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-bookwithsalon',
  templateUrl: './bookwithsalon.page.html',
  styleUrls: ['./bookwithsalon.page.scss'],
})

export class BookwithsalonPage implements OnInit {
  input={data:[]}
  item = true;
  unit: string;
  unit1: string;
  staff = [];
  userToken
timeinterval;
loaderAnimate = true
openTime =parseInt(this.backend.selectedsalon[0].openTime[0]+this.backend.selectedsalon[0].openTime[1]);
closeTime =parseInt(this.backend.selectedsalon[0].closeTime[0]+this.backend.selectedsalon[0].closeTime[1]);
staffnames =[];
  isvalidated = true;
  events = [];
  name="";
surname ="";
d1: Date;
d2: Date;
d3: Date;
testarray2 = [];

  constructor(public popoverController:PopoverController,private oneSignal: OneSignal,public loadingController:LoadingController,public backend: BackendService, public control: ControlsService, public alertController: AlertController, public modalController: ModalController)
   {

    
   console.log(this.openTime,"+",this.closeTime)
console.log("Gender = ",this.backend.genderOptions)

if(this.backend.genderOptions=='male')
{
this.timeinterval =30;
}
else
{
  this.timeinterval =60;
}

    this.Loading()
   
   this.cdate();
   
    let cdate = new Date();
    cdate.getFullYear();
    let cd1 = new Date();
    this.oneSignal.getIds().then((res)=>{ 
      this.booking.UserTokenID =  res.userId
})
    this.testarray = [];
console.log(this.backend.salonsDisply[0].TokenID)
  
     


  }

  poppy()
  {
    console.log("poppy")
    this.presentPopover({value:500})
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ZeroPage,
      backdropDismiss:false,
      translucent:false,
      mode:"ios",
      event: ev
      
      
    });

    popover.onDidDismiss().then(val=>{
      console.log(val)
      this.hairdresser =val.data.name;
       this.dresserLoading();
    })
    return await popover.present();



  }

  markDisabled = (date: Date) => {
    var current = new Date(this.cdate());
    return date < current;
};

  async Loading() {
  setTimeout(() => {
    this.loaderAnimate = false;
     this.poppy();
  }, 2000);

  }

  // async presentAlertRadio() {
  //   let input=this.input;
   
  //   console.log(input);
  //   const alert = await this.alertController.create({
  //     header: 'Pick any hairdresser.',
  //     inputs: input.data,
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('Confirm Cancel');
  //           this.control.router.navigate(['viewsalon']);
  //         }
  //       }, {
  //         text: 'Ok',
  //         handler: (data) => {
  //           console.log(data);

  //           if(data==undefined)
  //           {
  //             this.presentToast();
  //             this.control.navCtrl.navigateRoot('viewsalon');
  //           }
  //           else{
  //           this.hairdresser =data;
  //           this.dresserLoading();
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }




async presentToast() {
    const toast = await this.control.toastController.create({
      message: 'Pick a hairdresser\'s name!',
      duration: 5000
    });
    toast.present();
  }
  booking: bookings = {
    name: this.backend.username,
    surname: this.backend.surname,
    cell: this.backend.profiles[0].cell,
    salonname: this.backend.salonname,
    salonlocation: this.backend.salonlocation,
    hairstyletype: this.backend.hairstyletype,
    hairstyleprice: this.backend.hairstyleprice,
    estimatedtime: this.backend.estimatedtime,
    sessiontime: this.backend.sessiontime,
    sessionendtime: "",
    hairdresser: "",
    userdate: undefined,
    status: "Active",
    status2: "Active",
    salonuid: this.backend.salonuid,
    hairstyleimage: this.backend.hairstyleimage,
    useruid:firebase.auth().currentUser.uid,
    //  bookingid:Math.floor(Math.random() * 2000000).toString(),
    TokenID:this.backend.selectedsalon[0].TokenID,
    payment:"Unpaid",
 
    UserTokenID:"",
    
    late:"",
    saloncell:this.backend.selectedsalon[0].SalonContactNo
  }
  currentdate;
  futuredate;
  formodal: boolean = false;
  ngOnInit() {
    console.log(this.booking)
    this.staffnames =[];
    this.backend.staffnames =[];
  this.backend.gethairdresser().where("specialisation","==",this.backend.genderOptions).get().then(val => {
    val.forEach(stav => {
      this.staffnames.push(stav.data())
      
      this.backend.staffnames.push(stav.data())

      this.input.data.push({name:stav.data().name,type: 'radio',label:stav.data().name.toString(),value:stav.data().name.toString()}) 
      console.log(this.input)
      
      this.staff.push(stav.data());
    })
  })


  this.backend.gethairdresser().where("specialisation","==","both").get().then(val => {
    val.forEach(stav => {
      this.staffnames.push(stav.data())
      this.backend.staffnames.push(stav.data());
      console.log(this.backend.staffnames)
      this.input.data.push({name:stav.data().name,type: 'radio',label:stav.data().name.toString(),value:stav.data().name.toString()}) 
      console.log(this.input)
      
      this.staff.push(stav.data());
    })
  })
    
   
  }
 
  //this is the date inputed by the user
  userdate;

  //we need the mmaximum operating hours for the salon
  salonoperatinghours = 8;

  isv: boolean = false
  blocker: boolean = false;



  todate;




  /////This function prevents booking past and future dates.
  getfuturedate(booking) {

    let cdate = new Date();
    let cd1 = new Date();

    // this.cdate();

    cdate.getDay();
    this.currentdate = (cdate.getFullYear() + "-" + (cd1.getMonth() + 1) + "-" + cdate.getDate());

    this.futuredate = (cdate.getFullYear() + "-" + (cd1.getMonth() + 1) + "-" + cdate.getDate());

    console.log("futuredate 1=", this.futuredate);
    // we need the future date to prevent unneccessary future bookings
    if (cdate.getDate() > 28) {

      if ((cd1.getMonth() + 2) < 10) {
        this.futuredate = (cdate.getFullYear() + "-0" + (cd1.getMonth() + 2) + "-" + ((cdate.getDate() + 7 - 31)));

        if ((cdate.getDate() + 7 - 31) < 10) {
          this.futuredate = (cdate.getFullYear() + "-0" + (cd1.getMonth() + 2) + "-0" + ((cdate.getDate() + 7 - 31)));
        }
      }


      console.log("futuredate1", this.futuredate)

    }
    else {
      this.futuredate = (cdate.getFullYear() + "-" + (cd1.getMonth() + 1) + "-" + (cdate.getDate() + 7));

      if ((cd1.getMonth() + 1) < 10) {
        this.futuredate = (cdate.getFullYear() + "-0" + (cd1.getMonth() + 1) + "-" + ((cdate.getDate() + 7)));

        if ((cdate.getDate()) < 10) {
          this.futuredate = (cdate.getFullYear() + "-0" + (cd1.getMonth() + 1) + "-0" + ((cdate.getDate() + 7)));
        }
      }
      console.log("futuredate2", this.futuredate)

    }


    console.log("futuredate", this.futuredate)

    if (booking.userdate > this.futuredate) {

      
      console.log("futureDate =", this.futuredate)
      this.FutureDateToast();
      this.isvalidated = true;
    
    }
    else
  
    {
    
     //return this.setbooking(booking);
    }


    //return this.futuredate;

  }


  event;
  setbooking(booking: bookings) {

    console.log("This is the ==", booking)

    this.testarray = [];
    this.blocker = false;
   
    // prevents incorrect dates from being selected

    //time estimated by the salon
      let estimatedhours = parseInt((booking.estimatedtime / 60).toString());
      let estimatedmins = booking.estimatedtime % 60;

      let overlap = 0;
      //initial time variables
      let hrs = parseFloat(this.booking.sessiontime[0] + this.booking.sessiontime[1]);
      let mins = parseFloat(this.booking.sessiontime[3] + this.booking.sessiontime[4]);


      //new time variables
      let newhrs;
      let newmins;

      newhrs = hrs + estimatedhours;
      newmins = mins;

      console.log("newmins = ", newmins)
      console.log("newhrs = ", newhrs)
//for the finish time to be accurately calculated, theses validations are neccessary
      if (newmins == 0 && newhrs >= 10 && booking.estimatedtime == 30) {
        newhrs;
        booking.sessionendtime = newhrs + ":30";
        console.log("Time 00 =", booking.sessionendtime)
        this.booking=booking;
      }
      else

        if (newmins == 30 && newhrs >= 10 && booking.estimatedtime == 30) {
          newhrs = newhrs + 1;
          booking.sessionendtime = newhrs + ":00";
          console.log("Time 00 =", booking.sessionendtime)
          this.booking=booking;
        }
        else

          if (newmins == 0 && newhrs < 10 && booking.estimatedtime == 30) {
            newhrs;
            booking.sessionendtime = "0" + newhrs + ":30";
            console.log("Time 00 =", booking.sessionendtime)
            this.booking=booking;
          }
          else

            if (newmins == 30 && newhrs < 10 && booking.estimatedtime == 30) {
              newhrs = newhrs + 1;
              booking.sessionendtime = "0" + newhrs + ":00";
              console.log("Time 00 =", booking.sessionendtime)
              this.booking=booking;
            }
            else

              if (newmins == 30 && newhrs >= 10 && booking.estimatedtime == 30) {
                newhrs = newhrs + 1;
                booking.sessionendtime = newhrs + ":" + newmins;
                console.log("Time 000 =", booking.sessionendtime)
                this.booking=booking;
              }
              else

                if (newhrs < 10 && newmins == 0) {
                  booking.sessionendtime = "0" + newhrs + ":00";
                  console.log("Time 1 =", booking.sessionendtime)
                  this.booking=booking;
                }
                else
                  if (newhrs < 10 && newmins == 30) {
                    booking.sessionendtime = "0" + newhrs + ":" + newmins;
                    console.log("Time 2 =", booking.sessionendtime)
                    this.booking=booking;
                  }
      if (newhrs >= 10 && newmins == 0 && booking.estimatedtime != 30) {
        booking.sessionendtime = newhrs + ":00";
        console.log("Time 11 =", booking.sessionendtime)
        this.booking=booking;
      }
      else
        if (newhrs >= 10 && newmins == 30 && booking.estimatedtime != 30) {
          booking.sessionendtime = newhrs + ":" + newmins;
          console.log("Time 22 =", booking.sessionendtime)
          this.booking=booking;
        }






    
  this.booking=booking;
 
    
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Please note!',
      message: 'Your booking is at ' + this.booking.salonname + ' hair salon in ' + this.booking.salonlocation + '\n' +
        ' from ' + this.booking.sessiontime + ' until ' + this.booking.sessionendtime + ' on '+this.booking.userdate+'.',
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

            
           
            if( this.backend.selectedsalon[0].TokenID){
              var notificationObj = {
                headings: {en:" NEW BOOKING ALERT! "},
                small_icon : '../src/assets/Untitled-1.jpg',
                contents: { en:  this.booking.name + " Has made a booking with "+ this.booking.hairdresser +" on "+ this.booking.userdate + " from " + this.booking.sessiontime+ " to "+ this.booking.sessionendtime },
                include_player_ids: [this.backend.selectedsalon[0].TokenID],
              }
              this.oneSignal.postNotification(notificationObj).then(res => {
               // console.log('After push notifcation sent: ' +res);
              })
            }
            let v1;
            let click = 1;
            firebase.firestore().collection('salonAnalytics').doc(this.backend.salonuid).collection('numbers').get().then(val => {
              console.log("These are the numbers", val)
              val.forEach(qu => {
                qu.id;
                console.log(qu.id)
                console.log(qu.data().numberofbookings)
                v1 = qu.data().numberofbookings;

                firebase.firestore().collection('salonAnalytics').doc(this.backend.salonuid).collection('numbers').doc(qu.id).update({ "numberofbookings": v1 + click }).then(zet => {
                  console.log(zet)
                })
              }


              )
            })
            firebase.firestore().collection('userAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').get().then(val => {
              console.log("These are the numbers", val)
              val.forEach(qu => {
                qu.id;
                console.log(qu.id)
                console.log(qu.data().numberofbookings)
                v1 = qu.data().numberofbookings;

                firebase.firestore().collection('userAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').doc(qu.id).update({ "numberofbookings": v1 + click }).then(zet => {
                  console.log(zet)
                })
              }

              )
            })

         
            this.control.navCtrl.navigateRoot('/success');
          
          }
        }
      ]
    });

    await alert.present();

  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  db = firebase.firestore();
  testarray = [];
  preventinputs:boolean;
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  


 async submit() {

   let booking =this.booking; 

    if (booking.sessiontime) {

      //time estimated by the salon
      let estimatedhours = parseInt((booking.estimatedtime / 60).toString());
      let estimatedmins = booking.estimatedtime % 60;




      let overlap = 0;
      //initial time variables
      let hrs = parseFloat(this.booking.sessiontime[0] + this.booking.sessiontime[1]);
      let mins = parseFloat(this.booking.sessiontime[3] + this.booking.sessiontime[4]);


      //new time variables
      let newhrs;
      let newmins;



      newhrs = hrs + estimatedhours;
      newmins = mins;

      console.log("newmins = ", newmins)
      console.log("newhrs = ", newhrs)

      if (newmins == 0 && newhrs >= 10 && booking.estimatedtime == 30) {
        newhrs;
        booking.sessionendtime = newhrs + ":30";
        console.log("Time 00 =", booking.sessionendtime)
      }
      else

        if (newmins == 30 && newhrs >= 10 && booking.estimatedtime == 30) {
          newhrs = newhrs + 1;
          booking.sessionendtime = newhrs + ":00";
          console.log("Time 00 =", booking.sessionendtime)
        }
        else



          if (newmins == 0 && newhrs < 10 && booking.estimatedtime == 30) {
            newhrs;
            booking.sessionendtime = "0" + newhrs + ":30";
            console.log("Time 00 =", booking.sessionendtime)
          }
          else

            if (newmins == 30 && newhrs < 10 && booking.estimatedtime == 30) {
              newhrs = newhrs + 1;
              booking.sessionendtime = "0" + newhrs + ":00";
              console.log("Time 00 =", booking.sessionendtime)
            }
            else

              if (newmins == 30 && newhrs >= 10 && booking.estimatedtime == 30) {
                newhrs = newhrs + 1;
                booking.sessionendtime = newhrs + ":" + newmins;
                console.log("Time 000 =", booking.sessionendtime)
              }
              else

                if (newhrs < 10 && newmins == 0) {
                  booking.sessionendtime = "0" + newhrs + ":00";
                  console.log("Time 1 =", booking.sessionendtime)

                }
                else
                  if (newhrs < 10 && newmins == 30) {
                    booking.sessionendtime = "0" + newhrs + ":" + newmins;
                    console.log("Time 2 =", booking.sessionendtime)

                  }
      if (newhrs >= 10 && newmins == 0 && booking.estimatedtime != 30) {
        booking.sessionendtime = newhrs + ":00";
        console.log("Time 11 =", booking.sessionendtime)

      }
      else
        if (newhrs >= 10 && newmins == 30 && booking.estimatedtime != 30) {
          booking.sessionendtime = newhrs + ":" + newmins;
          console.log("Time 22 =", booking.sessionendtime)

        }

      

    

       




    }




    this.presentAlertConfirm()


  }

  getevents() {
    return this.events;
  }


  setevents(setve) {
    this.events = setve;

    this.loadEvents();
    //console.log(this.events)
  }
  ////////////////////////////////////////////////////////////////

  back() {
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



  async bookingconfirm() {
    const alert = await this.alertController.create({
      header: 'If you are booking for someone else, enter their name.',
      inputs: [
        {
          name: 'othername',
          type: 'text',
          placeholder: 'Enter the name...'
        },
        {
          name: 'othersurname',
          type: 'text',
          placeholder: 'Enter the surname...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Save',
          handler: (name) => {
            console.log(name.othername,name.othersurname);
            this.booking.name =name.othername;
            this.booking.surname = name.othersurname;
          }
        }
      ]
    });

    await alert.present();
  }

  createRandomEvents() {
    var events = [];
  events =this.events;
  console.log("These are the Events = ",this.events)
    return events;
}



loadEvents() {

  //receives data from array "this.events"
  this.eventSource = this.getevents();
 

}

ev;
lastpopup:boolean =false;
async smallLoading() {
  this.loaderAnimate = true
  const loading = await this.loadingController.create({
    spinner: null,
    cssClass:null,
    duration: 100
  });
  await loading.present();

  const { role, data } = await loading.onDidDismiss();
  if(this.lastpopup ==true)
  {
   console.log("lastpopup") 
  }
  else
  {
   console.log("Nopopup") 
  }
  this.loaderAnimate = false
  
  console.log('Loading dismissed!');
}



 onTimeSelected = (ev: { selectedTime: Date, events: any[] }) => {
 
  console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0));
console.log("EVents clicked =",ev)
  console.log("this is the time =" , ev.selectedTime.toString().slice(16,21));
  console.log("this is the date =" , ev.selectedTime.toLocaleDateString());

  this.smallLoading();
 
  if(this.calendar.mode== 'month')
  {
  
  }
else
{
  this.loaderAnimate = true;
 this.ev =ev;
  this.booking.sessiontime=ev.selectedTime.toString().slice(16,21);

  this.todate = (new Date(ev.selectedTime).getFullYear().toString()) + '-' + (new Date(ev.selectedTime).getMonth()) + '-' + (new Date(ev.selectedTime).getDate());
  if ((new Date(ev.selectedTime).getMonth() + 1) < 10) {

    this.todate = (new Date(ev.selectedTime).getFullYear().toString()) + '-0' + (new Date(ev.selectedTime).getMonth() + 1) + '-' + (new Date(ev.selectedTime).getDate());
    if ((new Date().getDate()) < 10) {
      this.todate = (new Date(ev.selectedTime).getFullYear().toString()) + '-0' + (new Date(ev.selectedTime).getMonth() + 1) + '-0' + (new Date(ev.selectedTime).getDate());
    }

  }
else if ((new Date(ev.selectedTime).getMonth() + 1) >= 10)
{
this.todate = (new Date(ev.selectedTime).getFullYear().toString()) + '-' + (new Date(ev.selectedTime).getMonth() + 1) + '-' + (new Date(ev.selectedTime).getDate());

if ((new Date(ev.selectedTime).getDate()) < 10) {
  this.todate = (new Date(ev.selectedTime).getFullYear().toString()) + '-' + (new Date(ev.selectedTime).getMonth() + 1) + '-0' + (new Date(ev.selectedTime).getDate());
}
}

  console.log("selected datedate =", this.todate)
  this.booking.userdate =this.todate;




  if (this.todate> this.futuredate) {


    console.log("futureDate =", this.futuredate)
    this.booking.userdate=undefined;
    this.FutureDateToast();
    this.isvalidated = true;

  
  }
  else
  if (this.cdate() > this.todate) {
  
    this.booking.userdate=undefined;
  
    this.PastDateToast();
    this.isvalidated = true;
     console.log("pastdate")
  
  
  
  
  }

}

}




async FutureDateToast() {

  
  const alert = await this.alertController.create({
    header: 'Oops!',
    cssClass: 'secondary',
    message: 'You cannot select a date greater than 7 days from today!',
    buttons: [
    
       {
        text: 'Okay',
    
        handler: () => {
          console.log('Confirm Okay');
          this.isvalidated =true;
          this.today();
        }
      }
    ]
  });
  
 
  await alert.present();
  alert.onDidDismiss().then(val=>{
    this.today();
    console.log('Yes/No', val);
    this.isvalidated =true;
})
  
}










async PastDateToast() {
  
  const alert = await this.alertController.create({
    header: 'Oop!',
    message: 'You cannot select a past date!',
    buttons: [
    
       {
        text: 'Okay',
    
        handler: () => {
          console.log('Confirm Okay');
          this.isvalidated =true;
        }
      }
    ]
  });
  
  await alert.present();


  alert.onDidDismiss().then(val=>{
    
    console.log('No', val);
    this.isvalidated =true;
})
}











pickdates() {
  console.log()
  if(this.val ==false)
  {
    this.booking.name =this.name;
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
    const toast = await this.control.toastController.create({
      message: 'Enter the name and surname.',
      duration: 5000
    });
    toast.present();
  
  }


hairdresser;

  async dresserLoading() {
    // const loading = await this.loadingController.create({
    //   message: 'Please wait...',
    //   duration: 2500
    // });
    // await loading.present();
  
    // const { role, data } = await loading.onDidDismiss();
    this.testbooking(this.booking);
     this.otherLoading();
    console.log('Loading dismissed!');
  }

  async otherLoading() {
    this.loaderAnimate = true
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass:null,
      duration: 1500
    });
    await loading.present();
  
    const { role, data } = await loading.onDidDismiss();
    this.loaderAnimate = false
    this.eventspopulation();
    this.present2();
    //this.setbooking(this.booking)
    console.log('Loading dismissed!');
  }


  testbooking(booking) {
console.log(booking)
booking.userdate=this.todate;

    this.events = [];
    this.testarray = [];
   

    this.db.collection('Bookings').where("salonuid","==",booking.salonuid).where("hairdresser","==",this.hairdresser).where('userdate','>=',this.cdate()).orderBy("userdate", "desc").limit(50).get().then(val => {
      if (val.size == 0) {
     
        this.control.SlotToast2();
       
      }
      val.forEach(doc => {
        this.testarray.push(doc.data());

        //console.log(doc.data())
      

      });

    });
console.log("here = ",this.testarray)
     }



  timeList: Array<{}> = [
    {
      message1: String,
      start: Date,
      message2: String,
      End: Date,

    }
  ];



  
  
  




  eventspopulation()
{

  this.testarray2 =this.testarray;
 let booking = this.booking;
 
   console.log("Events booking = ",booking)

console.log("events population = ",this.testarray2)
console.log("Testarray length =",this.testarray2.length)

  for (let i = 0; i < this.testarray2.length; i++) {

    this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime));

    this.d2 = new Date((this.testarray2[i].userdate + 'T') + (this.testarray2[i].sessiontime));

console.log("Error here = ",this.d2)
    //console.log("Second condition for end time =", (this.testarray2[i].sessionendtime[0]))
    this.d3 = new Date((this.testarray2[i].userdate + 'T') + (this.testarray2[i].sessionendtime));

    let a = "From ";
    let b = " until";
    let x = this.d2;
    let y = this.d3;

    this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime));
    this.d2 = new Date((booking.userdate + 'T') + (booking.sessionendtime));

    this.events.push({
      title: this.testarray2[i].hairstyletype,
      startTime: new Date(x),
      endTime: new Date(y),
      allDay: false
    })
    //this function loads the events into the events function
    this.setevents(this.events);
    console.log("events = ",this.events);
  }

  this.getfuturedate(booking);
}



  eventSource;
  viewTitle;
  isToday: boolean;
  calendar = {
    mode: 'day',
    currentDate: new Date()
  }; // these are the variables used by the calendar.

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

monthcolor ='rgb(179, 125, 93)';
daycolor ='#DB5A6B';
weekcolor ='rgb(179, 125, 93)';
  changeMode(mode) {
    if(mode =='month')
    {
      this.today();
      this.monthcolor ='#DB5A6B'
      this.daycolor ='rgb(179, 125, 93)';
this.weekcolor='rgb(179, 125, 93)'
    }
    else
    if(mode =='day')
    {
      this.today();
      this.monthcolor ='rgb(179, 125, 93)'
      this.daycolor ='#DB5A6B';
this.weekcolor='rgb(179, 125, 93)'
    }
    else  if(mode =='week')
    {
      this.today();
      this.monthcolor ='rgb(179, 125, 93)'
      this.daycolor ='rgb(179, 125, 93)';
this.weekcolor='#DB5A6B';
    }
    this.calendar.mode = mode;
  }


  today() {
    this.calendar.currentDate = new Date();
  }

  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }

  onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }
 


  cdate() {
   let todate;
    todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth()) + '-' + (new Date().getDate());
    if ((new Date().getMonth() + 1) < 10) {

      todate = (new Date().getFullYear().toString()) + '-0' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
      if ((new Date().getDate()) < 10) {
        todate = (new Date().getFullYear().toString()) + '-0' + (new Date().getMonth() + 1) + '-0' + (new Date().getDate());
      }

    }
else if ((new Date().getMonth() + 1) >= 10)
{
  todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());

  if ((new Date().getDate()) < 10) {
    todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth() + 1) + '-0' + (new Date().getDate());
  }
}

    console.log("Currentdate =", todate)
    
    return todate;
  }


  async timeAlertConfirm() {
   
//console.log(this.ev.events[0].endTime)
this.setbooking(this.booking);
this.findtime(this.booking);
this.isvalidated =false;



   if( (this.ev.events !== undefined && this.ev.events.length !== 0))
   {
this.isvalidated=true;
    const alert = await this.alertController.create({
      header: 'Oops!',
      cssClass: 'secondary',
      message: 'There is already a booking at '+this.booking.sessiontime+'. Choose another date or time.',
      buttons: [
      
         {
          text: 'Okay',
      
          handler: () => {
            console.log('Confirm Okay');
            this.isvalidated =true;
          }
        }
      ]
    });
    
    await alert.present();



    this.booking.sessiontime=undefined;
    this.booking.sessionendtime=undefined;
  console.log("1141",this.booking)
  }
else
{
  
  this.booking.userdate=this.todate;
  this.booking.hairdresser=this.hairdresser;
}


  }

text;

 pink ="#DB5A6B";

val2 =false;
   
findtime(booking) {
  
this.text ="Time:"+booking.sessiontime+"-"+booking.sessionendtime+", Date:"+booking.userdate+"\nStylist:"+this.hairdresser; 
  for (let i = 0; i < this.events.length; i++) {


    this.d1 =  new Date( this.booking.userdate+'T'+this.booking.sessionendtime);

    this.d2 = new Date(this.events[i].startTime);
    this.d3 = new Date(this.events[i].endTime);

    console.log("Second condition for end time =", this.d1,this.d2,this.d3)

    if (this.d2 < this.d1 && this.d1 < this.d3 ) {

     this.presentToastWithOptions();
   

     console.log("Booking Error slot overlap ")
  
   
    }
 


    


  }
  

  this.findtime2(this.booking);
 

}


findtime2(booking) {
  
console.log("findtime2")

  for (let i = 0; i < this.events.length; i++) {

    
    this.d1 =  new Date(this.events[i].startTime);
    console.log(this.d1)
    this.d2 = new Date(this.booking.userdate+'T'+booking.sessiontime);
    this.d3 = new Date(this.booking.userdate+'T'+booking.sessionendtime);

    console.log("xx1 = ", this.d1)
    console.log("xx2 = ", this.d2)
    console.log("xx3 = ", this.d3)

    if (this.d2 < this.d1 && this.d1 < this.d3 ) {

    this.presentToastWithOptions2();
    

     console.log("Booking Error slot between ")
  
     return  0;
    }
 


  }
  

}






async presentToastWithOptions() {
  const alert = await this.alertController.create({
    header: 'Oops!',
    cssClass: 'secondary',
    message: 'The time you selected overlaps into another booking. Choose another time or date.',
    buttons: [
    
       {
        text: 'Okay',
    
        handler: () => {
          console.log('Confirm Okay');
          this.isvalidated =true;
        }
      }
    ]
  });
  
  await alert.present();

  this.isvalidated =true;
}





async presentToastWithOptions2() {

  this.isvalidated =true;
  const loading = await this.loadingController.create({
    spinner: null,
    duration: 10,
    cssClass: null,
  });

   loading.present();

   loading.dismiss().then(val=>{
    console.log('Toaster dismissed!');
    this.booking.sessionendtime=undefined;
    this.booking.sessiontime=undefined;
    this.booking.userdate =undefined;
    this.isvalidated =true;
   })
 
}



async present2() {
  const alert = await this.alertController.create({
    header: 'Are you booking for yourself or someone else?',
    cssClass: 'secondary',
    backdropDismiss:false,
    inputs: [
      {
        name: 'Myself',
        type: 'radio',
        label: 'Myself',
        value: 'Myself',
        checked: true
      },
      {
        name: 'Someone else',
        type: 'radio',
        label: 'Someone else',
        value: 'Someone else'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
          this.presentToast3();
        }
      }, {
        text: 'Ok',
        handler: (all) => {
          console.log('Confirm Ok',all);

          if(all !="Myself")
          {
            this.presentAlertPrompt();
          }
          
        }
      }
    ]
  });

  await alert.present();
}



async presentAlertPrompt() {
  const alert = await this.alertController.create({
    header: 'Fill in details below.',
    cssClass: 'secondary',
    backdropDismiss:false,
    inputs: [
      {
        name: 'name1',
        type: 'text',
        placeholder: 'Enter their name'
      },
      {
        name: 'name2',
        type: 'text',
        placeholder: 'Enter their surname'
      },
    
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        
        handler: () => {
          console.log('Confirm Cancel');
          this.presentToast3();
        }
      }, {
        text: 'Ok',
        handler: (name1) => {
          console.log(name1);
          if(name1.name1 ==undefined || name1.name2 ==undefined || name1.name1 =="" || name1.name2 =="")
        {

         this.presentToast4()
  
        }
        else{
          this.booking.name =name1.name1;
          this.booking.surname =name1.name2;
        }
        }
      }
    ]
  });

  await alert.present();
}


async presentToast3() {
  const toast = await this.control.toastController.create({
    message: 'The booking will be for '+this.booking.name+" "+this.booking.surname+".",
  
    duration: 5000
  });
  toast.present();
}


async presentToast4() {
  const toast = await this.control.toastController.create({
    message: 'The booking will be for '+this.booking.name+" "+this.booking.surname+" because the other information was not recorded.",
 
    duration: 5000
  });
  toast.present();
}


closebutton()
{
  this.isvalidated=true;
}
}




