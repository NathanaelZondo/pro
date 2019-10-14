import { Component, OnInit } from '@angular/core';
import { ViewController } from '@ionic/core';
import * as firebase from 'firebase';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import { ModalController, AlertController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
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
  currentdate;
  useruid;
  newdata = [];
  ob = {};
  buttonactive;
  isvalidated = true;
  haidressername;
  hairsalon;
  alldata
  constructor(private modalController: ModalController,
    public backend: BackendService,
    public control: ControlsService,
    private oneSignal: OneSignal,
    private alertController: AlertController,
    private callNumber: CallNumber) {
    this.bookingdetails = this.backend.bookingdetails;

    console.log(this.bookingdetails)

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

    this.cancelbookingConfirm();

    console.log(this.alldata)

  }
  call(){
    this.callNumber.callNumber( this.alldata.saloncell, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }
  cancel(v) {
    let x = v;
    console.log("USER Clicked", x);

    this.haidressername = x.hairdresser;
    this.hairsalon = x.salonname;
    x.status = "cancelled";
    firebase.firestore().collection('Bookings').doc(x.id).delete();

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
            firebase.firestore().collection('Bookings').doc(this.alldata.id).delete();

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
        // input date with min & max


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
          handler: (name1) => {
            console.log(name1.name1);
            if (this.alldata.TokenID) {
              var notificationObj = {
                headings: { en: " APPOINTMENT ALERT for:" + this.alldata.haidressername },
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
      ]
    });

    await alert.present();
  }


}
