import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import { ControlsService } from '../controls.service';
import * as firebase from 'firebase';
import { ModalPage } from '../modal/modal.page';
import { NavController, AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.page.html',
  styleUrls: ['./viewprofile.page.scss'],
})
export class ViewprofilePage implements OnInit {
  profiles = [];
  seeBookings = false
  userbooking = [];
  ob = {};
  isBooking = false
  constructor(private navCtrl:NavController, public modalController: ModalController,public backend: BackendService, public control: ControlsService,public alertController:AlertController) {
    this.profiles =this.backend.profiles;
    console.log(this.profiles)


   

  }

  ngOnInit() {



  }



  ionViewDidEnter()
  {
    this.getbookings();
  }




  viewdetails(x) {
    console.log(x)
    this.backend.setbookingdetails(x)
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage
    });
    modal.onDidDismiss().then(val=>{
      console.log(val)
      this.getbookings();
    })
     await modal.present();
  }

  bookings(){
    this.seeBookings = !this.seeBookings;
  }


  update() {
    
    this.control.router.navigateByUrl('/updateprofile');
  }

  signout() {

   this.signoutConfirm();
    
  }

  back() {
    this.navCtrl.setDirection('root');
    this.navCtrl.navigateRoot('/viewprofile');
  }



  async signoutConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
           
   this.backend.signout();
    this.navCtrl.setDirection('root');
    this.navCtrl.navigateRoot('/login');
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }



  getbookings()
  {
  
    this.userbooking =[];
    firebase.firestore().collection('Cancellations').where("useruid", "==", firebase.auth().currentUser.uid).orderBy("userdate", "desc").limit(10).get().then(val => {
      val.forEach(doc => {
        console.log(doc.id)
        this.ob = { id: doc.id };
        this.userbooking.push({ ...this.ob, ...doc.data() })
    
        console.log(this.userbooking)
    
    
      });
    });
    
    
    
        firebase.firestore().collection('Bookings').where("useruid", "==", firebase.auth().currentUser.uid).orderBy("userdate", "desc").limit(15).get().then(val => {
          val.forEach(doc => {
            console.log(doc.id)
            this.ob = { id: doc.id };
            this.userbooking.push({ ...this.ob, ...doc.data() })
    
            console.log(this.userbooking)
    
    
          });
        });
  
        this.isBooking = true
  }



}
