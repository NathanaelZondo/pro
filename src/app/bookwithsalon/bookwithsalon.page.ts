import { Component, OnInit, ɵConsole } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import { bookings } from '../booking';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';



@Component({
  selector: 'app-bookwithsalon',
  templateUrl: './bookwithsalon.page.html',
  styleUrls: ['./bookwithsalon.page.scss'],
})

export class BookwithsalonPage implements OnInit {

  item = true;
  unit: string;
  unit1: string;
  staff = [];

  markDisabled;

  isvalidated = true;
  constructor(public loadingController:LoadingController,public backend: BackendService, public control: ControlsService, public alertController: AlertController, public modalController: ModalController)
   {
    let cdate = new Date();
    cdate.getFullYear();
    let cd1 = new Date();

    this.testarray = [];

    this.control.tip();
    this.cdate();

    cdate.getDay();
    this.currentdate = (cdate.getFullYear() + "-" + (cd1.getMonth() + 1) + "-" + cdate.getDate());

    this.markDisabled = (date: Date) => {
      var current = new Date();
      return date < new Date(this.cdate());
  };


  }
  booking: bookings = this.backend.bookingdata;
  currentdate;
  futuredate;
  formodal: boolean = false;
  ngOnInit() {
    console.log(this.booking)
    this.onTimeSelected(this.booking)
    
    
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
  onTimeSelected( booking) {

    



    // console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
    //   (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);

    // if (parseFloat((new Date(ev.selectedTime).getMonth() + 1).toString()) < 10) {
    //   booking.userdate = new Date(ev.selectedTime).getFullYear().toString() + "-0" + (new Date(ev.selectedTime).getMonth() + 1).toString() + "-" + new Date(ev.selectedTime).getDate().toString();

    //   if (parseFloat(new Date(ev.selectedTime).getDate().toString()) < 10) {
    //     booking.userdate = new Date(ev.selectedTime).getFullYear().toString() + "-0" + (new Date(ev.selectedTime).getMonth() + 1).toString() + "-0" + new Date(ev.selectedTime).getDate().toString();
    //     console.log("vv", booking.userdate)
    //   }
    // }

    // else {
    //   booking.userdate = new Date(ev.selectedTime).getFullYear().toString() + "-" + (new Date(ev.selectedTime).getMonth() + 1).toString() + "-" + new Date(ev.selectedTime).getDate();

    //   if (parseFloat(new Date(ev.selectedTime).getDate().toString()) < 10) {
    //     booking.userdate = new Date(ev.selectedTime).getFullYear().toString() + "-" + (new Date(ev.selectedTime).getMonth() + 1).toString() + "-0" + new Date(ev.selectedTime).getDate().toString();
    //     console.log("ww", booking.userdate)
    //   }

    // }

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
        ' from ' + this.booking.sessiontime + ' until ' + this.booking.sessionendtime + '.',
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
      if (val.size == 0) {
        this.isvalidated = false;
        this.control.SlotToast2();
       
      }
      val.forEach(doc => {
        this.testarray.push(doc.data());

        console.log(doc.data())
        this.findtime(booking);

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

  d1: Date;
  d2: Date;
  d3: Date;
  testarray2 = [];


  
  
  async SlotToast() {
    const toast = await this.control.toastController.create({
      message: 'Your selected time at '+this.booking.sessiontime+' with '+this.booking.hairdresser+' has already been booked.',
      duration: 5000
    });
    toast.present();
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  findtime(booking) {
    this.events = [];
    this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime));
    this.d2 = new Date((booking.userdate + 'T0') + (booking.sessionendtime));
    this.d3;

    

    //this.formodal=false;

    console.log("TestArray = ", this.testarray)

    for (let i = 0; i < this.testarray.length; i++) {

      this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime));

      this.d2 = new Date((this.testarray[i].userdate + 'T') + (this.testarray[i].sessiontime));


      console.log("Second condition for end time =", (this.testarray[i].sessionendtime[0]))

      this.d3 = new Date((this.testarray[i].userdate + 'T') + (this.testarray[i].sessionendtime));


      let d4 = new Date((booking.userdate + 'T') + (booking.sessionendtime));


      console.log("session end time = ", d4)

      let a = "From ";
      let b = " until";
      let x = this.d2;
      let y = this.d3;






      this.formodal = false;


      if (this.d2 <= this.d1 && this.d1 < this.d3) {

        this.formodal = true;
        this.isvalidated = true;
        
        
       // this.eventspopulation(this.booking);

       this.preventinputs =false;

       
    
       return  0;

        console.log("Booking Error slot occupied ")

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

            this.SlotToast();
          }
          else {
            this.isvalidated = true;

            this.SlotToast();
          }
        })
      })



      this.db.collection('Bookings').where("userdate","==",booking.userdate).where("sessionendtime", "==", booking.sessionendtime).where("salonuid","==",booking.salonuid).where("hairdresser","==",booking.hairdresser).get().then(val => {
        val.forEach(value => {
          console.log(value.data())
          if (value.data().sessiontime != "") {
            this.isvalidated = true;

            this.SlotToast();
          }
          else {
            this.isvalidated = true;

            this.SlotToast();
          }
        })
      })







    }



    

  }


eventspopulation()
{

  this.testarray2 =this.testarray;
 let booking = this.booking;
   console.log("Events booking = ",booking)

console.log("events population")
console.log("Testarray length =",this.testarray2.length)

  for (let i = 0; i <= this.testarray2.length; i++) {

    this.d1 = new Date((booking.userdate + 'T') + (booking.sessiontime));

    this.d2 = new Date((this.testarray2[i].userdate + 'T') + (this.testarray2[i].sessiontime));

console.log("Error here = ",this.d2)
    //console.log("Second condition for end time =", (this.testarray2[i].sessionendtime[0]))


    this.d3 = new Date((this.testarray2[i].userdate + 'T') + (this.testarray2[i].sessionendtime));


    let d4 = new Date((booking.userdate + 'T') + (booking.sessionendtime));


    //     console.log("session end time = ",d4)

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
 if(this.preventinputs==false)
 {
 this.control.SlotToast1();  
 }
  return 0;
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





  async eventsconfirm() {
    const alert = await this.alertController.create({
      header: 'Booking assisstant.',
      message: 'Would you like to view schedule for '+this.booking.hairdresser+'?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'dark',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {

            if (this.booking.hairdresser == "") {

              this.control.name();
        
            }
            else if (this.booking.userdate == "") {
        
              this.control.date();
        
            }
            else if (this.booking.sessiontime == "" ||this.booking.sessiontime==undefined) {
        
              this.control.time();
        
            }
            else
            {
              this.eventspopulation();
            
            }
          


          }
        }
      ]
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








async Loading() {
  const loading = await this.loadingController.create({
    message: 'Please wait...',
    duration: 5000
  });
  await loading.present();

  const { role, data } = await loading.onDidDismiss();
  this.eventsconfirm();
}

}




