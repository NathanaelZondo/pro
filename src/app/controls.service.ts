import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NavController,  AlertController, ToastController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
import { FirebaseAuth } from 'angularfire2';
import { Router } from '@angular/router';

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
      duration: 5000
    });
    await loading.present();
  
    const { role, data } = await loading.onDidDismiss();
  
    console.log('Loading dismissed!');
  }
  
  async LoginToast() {
    const toast = await this.toastController.create({
      message: 'Login successful.',
      duration: 5000
    });
    toast.present();
  }


  async RegToast() {
    const toast = await this.toastController.create({
      message: 'Registration successful.',
      duration: 5000
    });
    toast.present();
  }


  async BookToast() {
    const toast = await this.toastController.create({
      message: 'Booking successful.',
      duration: 5000
    });
    toast.present();
  }


  async LogoutToast() {
    const toast = await this.toastController.create({
      message: 'Logout successful.',
      duration: 5000
    });
    toast.present();
  }


  async ProfileToast() {
    const toast = await this.toastController.create({
      message: 'Profile created',
      duration: 5000
    });
    toast.present();
  }

  async ProfileupdateToast() {
    const toast = await this.toastController.create({
      message: 'Profile successfully updated. Changes will be visible after refreshing the page.',
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

  async PastDateToast() {
    const toast = await this.toastController.create({
      message: 'You cannot select a past date',
      duration: 5000
    });
    toast.present();
  }

  async FutureDateToast() {
    const toast = await this.toastController.create({
      message: 'You cannot select a day further than 7 days from today.',
      duration: 5000
    });
    toast.present();
  }

  async SlotToast() {
    const toast = await this.toastController.create({
      message: 'This booking has already been taken.',
      duration: 5000
    });
    toast.present();
  }

  async SlotToast1()
  {
    const toast = await this.toastController.create({
      message: 'Booking slot is currently empty.',
      duration: 5000
    });
    toast.present();

}



async name()
  {
    const toast = await this.toastController.create({
      message: 'Enter the name of the bookie.',
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
    message: 'Hairdresser is completely free for the day.',
    duration: 5000
  });
  toast.present();

}


async tip()
{
  const toast = await this.toastController.create({
    message: 'Fill all the inputs then click the calender to change dates.',
    duration: 7000
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

}

