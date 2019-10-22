import { Component, OnInit } from '@angular/core';
import { ViewController, toastController } from '@ionic/core';
import * as firebase from 'firebase';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import { ModalController, AlertController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  bookingdetails: Array<{}>
  low = false;
  buttonDisabled = true;
  surname;
  userdate;
  hairdresser;
  salonname;
  currentdate =this.cdate();
  useruid;
  newdata = [];
  ob = {};
  buttonactive;
  isvalidated = true;
  haidressername;
  hairsalon;
  alldata;
  userbooking =[];
  SalonNumber
  constructor(private modalController: ModalController,
    public backend: BackendService,
    public control: ControlsService,
    private oneSignal: OneSignal,
    private alertController: AlertController,
    private callNumber: CallNumber) {
    this.bookingdetails = this.backend.bookingdetails;
console.log('number');

    console.log(this.bookingdetails)
  this.cdate() ;

  }

  ngOnInit() {
  
  }


  async back() {

    await this.modalController.dismiss();
  }
  forthealert(x) {
    this.alldata = x;
    this.haidressername = x.hairdresser;
    this.hairsalon = x.salonname;
this.SalonNumber = x.cell
    this.cancelbookingConfirm();

  

  }
  call(x){
    console.log('number', this.alldata );
    
    this.callNumber.callNumber( this.SalonNumber, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }
  cancel(v) {
    let x = v;
    console.log("USER Clicked", x);

    this.haidressername = x.hairdresser;
    this.hairsalon = x.salonname;
 

  }
  async cancelbookingConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you want to cancel booking with ' + this.haidressername + " at " + this.hairsalon + " hairsalon?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.cancel(this.alldata);

            this.control.cancelbookingToast();
            console.log('Confirm Okay');

          
            this.alldata.status ="cancelled";
            this.alldata.status2 ="cancelled";
            firebase.firestore().collection('Bookings').doc(this.alldata.id).delete();
            firebase.firestore().collection('Cancellations').add(this.alldata);
     
            if (this.alldata.TokenID) {
              var notificationObj = {
                headings: { en: "APPOINTMENT CANCELLATION! " },
                contents: { en: "Hey customer " + this.alldata.name + " Has cancelled their booking with " + this.alldata.hairdresser + " on " + this.alldata.userdate + " at " + this.alldata.sessiontime },
                include_player_ids: [this.alldata.TokenID],
              }
              this.oneSignal.postNotification(notificationObj).then(res => {
                // console.log('After push notifcation sent: ' +res);
              })
            }

            firebase.firestore().collection('Analytics').doc(this.alldata.salonuid).get().then(val => {

              console.log("numbers = ", val.data())

              firebase.firestore().collection('Analytics').doc(this.alldata.salonuid).set({ numberofviews: val.data().numberofviews, numberoflikes: val.data().numberoflikes, usercancel: val.data().usercancel + 1, saloncancel: val.data().saloncancel, allbookings: val.data().allbookings, users: val.data().users });
            });

          }
        }
      ]
    });

    await alert.present();
  }

  late(x) {
    this.alldata = x;
    this.haidressername = x.hairdresser;
    this.hairsalon = x.salonname;
    this.presentAlertPrompt(x)

  }
  async presentAlertPrompt(x) {
    const alert = await this.alertController.create({
      header: 'Are you going to be late?',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Give ' + x.hairdresser + ' your reason...'
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
          text: 'Send',
          handler:async (name1) => {
            console.log(name1.name1);

 if(name1.name1 =="")
{
alert.dismiss();

    const toast = await this.control.toastController.create({
      message: 'Message cannot be empty,Please give a reason for being late.',
      duration: 3000
    });
    toast.present();
    
  }
  else{

            if (this.alldata.TokenID) {
              var notificationObj = {
                headings: { en: " APPOINTMENT ALERT for:"  },
                small_icon: '../src/assets/Untitled-1.jpg',
                contents: { en: "Hey! " + this.alldata.name + " will be late  on " + this.alldata.userdate + " at " + this.alldata.sessiontime + " their reason is: \"" + name1.name1 + "\"" },
                include_player_ids: [this.alldata.TokenID],
              }
              this.oneSignal.postNotification(notificationObj).then(res => {
                // console.log('After push notifcation sent: ' +res);
              })
            }
            firebase.firestore().collection('Bookings').doc(x.id).update({
              late: name1.name1
            }).then(res => {
              console.log(res)
            });
          }
        }
        }
      ]
    });

    await alert.present();
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
 


   


}
