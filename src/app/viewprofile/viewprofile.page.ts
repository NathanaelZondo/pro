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
  constructor(private navCtrl:NavController, public modalController: ModalController,public backend: BackendService, public control: ControlsService,public alertController:AlertController) {
    this.profiles =this.backend.profiles;
    console.log(this.profiles)
  }

  ngOnInit() {

  //  this.control.Loading2();


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
    return await modal.present();
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
    this.navCtrl.navigateRoot('/navigation');
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
}
