import { Component, OnInit, ɵConsole } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import { bookings } from '../booking';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-dates',
  templateUrl: './dates.page.html',
  styleUrls: ['./dates.page.scss'],
})
export class DatesPage implements OnInit {

  
  item = true;
  unit: string;
  unit1: string;
  staff = [];

  markDisabled;

  isvalidated = true;
  constructor(public loadingController:LoadingController,public backend: BackendService, public control: ControlsService, public alertController: AlertController, public modalController: ModalController,  private oneSignal: OneSignal,)
   {

    console.log(this.booking)
    let cdate = new Date();
    cdate.getFullYear();
    let cd1 = new Date();

    this.testarray = [];
    this.backend.gethairdresser().get().then(val => {
      val.forEach(stav => {
        console.log(stav.data())
        this.staff.push(stav.data());
      })
    })

    this.cdate();

    cdate.getDay();
    this.currentdate = (cdate.getFullYear() + "-" + (cd1.getMonth() + 1) + "-" + cdate.getDate());

    this.markDisabled = (date: Date) => {
      var current = new Date();
      return date < new Date(this.cdate());
  };


  }

  currentdate;
  futuredate;
  formodal: boolean = false;
  ngOnInit() {
//this.bookingconfirm();
  }
  booking: bookings = {
    name: this.backend.username,
    surname: this.backend.surname,
    cell: this.backend.cell,
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
    bookingid:Math.floor(Math.random() * 2000000).toString()
  }
  //this is the date inputed by the user
  userdate;

  //we need the mmaximum operating hours for the salon
  salonoperatinghours = 8;

  isv: boolean = false
  blocker: boolean = false;



  todate;
  //Get current date
  cdate() {
   
    this.todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth()) + '-' + (new Date().getDate());
    if ((new Date().getMonth() + 1) < 10) {

      this.todate = (new Date().getFullYear().toString()) + '-0' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
      if ((new Date().getDate()) < 10) {
        this.todate = (new Date().getFullYear().toString()) + '-0' + (new Date().getMonth() + 1) + '-0' + (new Date().getDate());
      }

    }
else if ((new Date().getMonth() + 1) >= 10)
{
  this.todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());

  if ((new Date().getDate()) < 10) {
    this.todate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth() + 1) + '-0' + (new Date().getDate());
  }
}

    console.log("Currentdate =", this.todate)
    return this.todate;
  }



  /////This function prevents booking past and future dates.
  getfuturedate(booking) {

    let cdate = new Date();
    let cd1 = new Date();

    this.cdate();

    cdate.getDay();
    this.currentdate = (cdate.getFullYear() + "-" + (cd1.getMonth() + 1) + "-" + cdate.getDate());

    this.futuredate = (cdate.getFullYear() + "-" + (cd1.getMonth() + 1) + "-" + cdate.getDate());

    console.log("futuredate 1=", this.futuredate);

this.booking.userdate =this.booking.userdate.slice(0,10);
console.log(this.booking.userdate)
    
    
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
      this.control.FutureDateToast();
      this.isvalidated = true;
    
    }
    else
    if (this.cdate() > booking.userdate) {



      this.control.PastDateToast();
      this.isvalidated = true;
      console.log("pastdate")
    



    }
    else
    if (booking.hairdresser == "") {

      this.control.name();

    }
    else if (booking.userdate == "") {

      this.control.date();

    }
    else if (booking.sessiontime == "" ||booking.sessiontime==undefined) {

      this.control.time();

    }
    else
    {
    
     return this.setbooking(booking);
    }






    //return this.futuredate;

  }









 

  //click event from the calendar
  onTimeSelected(booking) {

    
    this.backend.getbookingdata(booking);
console.log(booking)


    return this.getfuturedate(booking);
    
  }















  event;
  setbooking(booking: bookings) {


    this.Loading();






    console.log("This is the ==", booking)

    this.testarray = [];
    this.blocker = false;
    //this.backend.userbookings(booking);
    // prevents incorrect dates from being selected



    if (parseFloat(booking.sessiontime[0] + booking.sessiontime[1]) < 8 || parseFloat(booking.sessiontime[0] + booking.sessiontime[1]) > 18) {
      this.TimeAlert();
      this.isvalidated = true;
      return 0;
    }
    else if (parseFloat(booking.sessiontime[3] + booking.sessiontime[4]) > 0 && parseFloat(booking.sessiontime[3] + booking.sessiontime[4]) < 30) {

      console.log("block =", parseFloat(booking.sessiontime[3] + booking.sessiontime[4]))
      this.control.BlockToast();
      this.isvalidated = true;
      return 0;

    }
    else if (parseFloat(booking.sessiontime[3] + booking.sessiontime[4]) > 30 && parseFloat(booking.sessiontime[3] + booking.sessiontime[4]) <= 59) {

      console.log("block2 =", parseFloat(booking.sessiontime[3] + booking.sessiontime[4]))
      this.control.BlockToast();
      this.isvalidated = true;
      return 0;

    }
    else if (booking.sessiontime) {

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
  
    this.testbooking(this.booking)
    
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Please note!',
      message: 'Your booking is at ' + this.booking.salonname + ' hair salon in ' + this.booking.salonlocation + '\n' +
        ' from ' + this.booking.sessiontime + ' until ' + this.booking.sessionendtime + ' with '+this.booking.hairdresser+'.',
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
                contents: { en: "Hey " + this.booking.salonname + " " +this.booking.name + " Has made a booking with you"},
                include_player_ids: [this.backend.selectedsalon[0].TokenID],
              }
              this.oneSignal.postNotification(notificationObj).then(res => {
               // console.log('After push notifcation sent: ' +res);
              })
            }
      

            this.control.BookToast();
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
  testbooking(booking) {

    this.events = [];
    this.testarray = [];
    let hourRange = parseFloat(booking.sessiontime[0] + booking.sessiontime[1]);
    let minuteRange = parseFloat(booking.sessiontime[3] + booking.sessiontime[4])

    this.db.collection('Bookings').where("salonuid","==",booking.salonuid).where("hairdresser","==",booking.hairdresser).orderBy("userdate", "desc").limit(50).get().then(val => {
    if(val.empty)
    {
      this.isvalidated =false;
      this.preventinputs=true;
      console.log("heya!!!")
    }
      val.forEach(doc => {
        this.testarray.push(doc.data());

       // console.log(doc.data())
        this.findtime(booking);

      });

    });

   
  //  console.log("here = ",this.testarray)
  

  }



  timeList: Array<{}> = [
    {
      message1: String,
      start: Date,
      message2: String,
      End: Date,

    }
  ];

  d1: Date;
  d2: Date;
  d3: Date;
  testarray2 = [];


  
  
 


  async slotAlert() {
    const alert = await this.alertController.create({
      header: 'The date and time you have selected have already been booked.',
      message: 'Would you like to view the schedule for '+this.booking.hairdresser+'?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.control.navCtrl.setDirection('root');
            this.control.navCtrl.navigateRoot('/navigation'); 
          }
        }
      ]
    });

    await alert.present();
  }











  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  findtime(booking) {
    this.events = [];
    this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime));
    this.d2 = new Date((booking.userdate + 'T0') + (booking.sessionendtime));
    this.d3;

    

    //this.formodal=false;

   // console.log("TestArray = ", this.testarray)

    for (let i = 0; i < this.testarray.length; i++) {

      this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime));

      this.d2 = new Date((this.testarray[i].userdate + 'T') + (this.testarray[i].sessiontime));


     //console.log("Second condition for end time =", (this.testarray[i].sessionendtime[0]))

      this.d3 = new Date((this.testarray[i].userdate + 'T') + (this.testarray[i].sessionendtime));


      let d4 = new Date((booking.userdate + 'T') + (booking.sessionendtime));


      //console.log("session end time = ", d4)

      let a = "From ";
      let b = " until";
      let x = this.d2;
      let y = this.d3;






      this.formodal = false;


      if (this.d2 <= this.d1 && this.d1 < this.d3 ) {

        this.formodal = true;
        this.isvalidated = true;
        
        
       // this.eventspopulation(this.booking);

       this.preventinputs =false;
       console.log("Booking Error slot occupied ")
       this.control.router.navigate(['bookwithsalon']);
    
       return  0;

        

      }

      else {

        // console.log(" d1 =",this.d1," d2 =",this.d2," d3= ",this.d3);
        // console.log(this.d2>=this.d1 && this.d1<=this.d3)


        this.isvalidated = false;
        this.preventinputs =true;
       // this.control.SlotToast1();
     

      }
   

      this.db.collection('Bookings').where("userdate","==",booking.userdate).where("sessiontime", "==", booking.sessiontime).where("salonuid","==",booking.salonuid).where("hairdresser","==",booking.hairdresser).get().then(val => {
        val.forEach(value => {
          //console.log(value.data())
          if (value.data().sessiontime != "") {
            this.isvalidated = true;

           // this.slotAlert();
          }
          else {
            this.isvalidated = true;

            //this.slotAlert();
          }
        })
      })



      this.db.collection('Bookings').where("userdate","==",booking.userdate).where("sessionendtime", "==", booking.sessionendtime).where("salonuid","==",booking.salonuid).where("hairdresser","==",booking.hairdresser).get().then(val => {
        val.forEach(value => {
         // console.log(value.data())
          if (value.data().sessiontime != "") {
            this.isvalidated = true;

            //this.slotAlert();
          }
          else {
            this.isvalidated = true;

           // this.slotAlert();
          }
        })
      })







    }



    

  }





  eventSource;
  viewTitle;
  isToday: boolean;
  calendar = {
    mode: 'month',
    currentDate: new Date()
  }; // these are the variable used by the calendar.

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

  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }

  onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }
 

  events = [];



  submit(booking: bookings) {

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
    this.control.router.navigateByUrl('/dates');
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








async Loading() {
  const loading = await this.loadingController.create({
    message: 'Please wait...',
    duration: 5000
  });
  await loading.present();

  const { role, data } = await loading.onDidDismiss();
  
}

}




