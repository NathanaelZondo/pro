import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NavController,  AlertController, ToastController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
import { FirebaseAuth } from 'angularfire2';
import { Router,CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {



  constructor(
    public navCtrl: NavController, 
    public router:Router,
    public alertCrtl: AlertController,
    public toastController:ToastController,public loadingController:LoadingController
  ) { }

  async Loading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 6000
    });
    await loading.present();
  
    const { role, data } = await loading.onDidDismiss();
  
    console.log('Loading dismissed!');
  }


  async Loading2() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  
    const { role, data } = await loading.onDidDismiss();
  
    console.log('Loading dismissed!');
  }
  
  // async LoginToast() {
  //   const toast = await this.toastController.create({
  //     message: 'Login successful.',
  //     duration: 5000
  //   });
  //   toast.present();
  // }


  // async RegToast() {
  //   const toast = await this.toastController.create({
  //     message: 'Registration successful.',
  //     duration: 5000
  //   });
  //   toast.present();
  // }


  

  // async LogoutToast() {
  //   const toast = await this.toastController.create({
  //     message: 'Logout successful.',
  //     duration: 5000
  //   });
  //   toast.present();
  // }


  async ProfileToast() {
    const toast = await this.toastController.create({
      message: 'Profile created',
      duration: 5000
    });
    toast.present();
  }

  async ProfileupdateToast() {
    const toast = await this.toastController.create({
      message: 'Profile successfully updated.',
      duration: 5000
    });
    toast.present();
  }

  async DeletebookingToast() {
    const toast = await this.toastController.create({
      message: 'Booking deleted.',
      duration: 5000
    });
    toast.present();
  }

  



  async SlotToast1()
  {
    const toast = await this.toastController.create({
      message: 'Time slot is currently empty.',
      duration: 5000
    });
    toast.present();

}

async difftimeToast()
  {
    const toast = await this.toastController.create({
      message: 'Choose a different time or date or a different hairdresser.',
      duration: 5000
    });
    toast.present();

}



async name()
  {
    const toast = await this.toastController.create({
      message: 'Select the name of the hairdresser.',
      duration: 5000
    });
    toast.present();

}


async date()
  {
    const toast = await this.toastController.create({
      message: 'Enter your booking date.',
      duration: 5000
    });
    toast.present();

}

async employee()
  {
    const toast = await this.toastController.create({
      message: 'Select the name of the hairdresser.',
      duration: 5000
    });
    toast.present();

}

async time()
  {
    const toast = await this.toastController.create({
      message: 'Enter the booking time.',
      duration: 5000
    });
    toast.present();

}

async SlotToast2()
{
  const toast = await this.toastController.create({
    message: 'You will be the first person to book with this haidresser.',
    duration: 5000
  });
  toast.present();

}


async tip()
{
  const toast = await this.toastController.create({
    message: 'The time and date you entered are already booked.',
    duration: 5000
  });
  toast.present();

}

async profileToast() {
  const toast = await this.toastController.create({
    message: 'You cannot proceed without a profile.',
    duration: 5000
  });
  toast.present();
}


async picLoading() {
  const loading = await this.loadingController.create({
    message: 'Please wait...',
    duration: 15000
  });
  await loading.present();

  const { role, data } = await loading.onDidDismiss();

  console.log('Loading dismissed!');
}



async newprofileToast() {
  const toast = await this.toastController.create({
    message: 'You have successfully registered.',
    duration: 15000
  });
  toast.present();
}

async BlockToast() {
  const toast = await this.toastController.create({
    message: 'You can only input an hour or 30 mins after an hour.',
    duration: 5000
  });
  toast.present();
}

async cancelbookingToast() {
  const toast = await this.toastController.create({
    message: 'Booking successfully cancelled.',
    duration: 5000
  });
  toast.present();
}

}

