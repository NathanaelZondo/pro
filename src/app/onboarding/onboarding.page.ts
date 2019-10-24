import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlsService } from '../controls.service';
import { Storage } from '@ionic/storage';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild('slides', { static: true }) slides: IonSlides;
  show = false;
  constructor(public control: ControlsService, private storage: Storage) { }

  ngOnInit() {
    this.slides.lockSwipes(true)
  }
  
  async signin() {
    await this.storage.set('tutorialComplete', true);
    this.control.navCtrl.setDirection('root');
    this.control.navCtrl.navigateRoot('/login');
  }


  nextslides() {
    if (this.slides.isEnd) {
      // this.show = false
      this.slides.lockSwipes(false)
      this.slides.slideNext(); 
   
      this.slides.getActiveIndex().then(index =>{
        console.log('slid', index );
        if(index == 2){
          this.show = true;
        }
      })
    

      this.slides.lockSwipes(true)
    } else {
      this.slides.slideNext();
    } 
  }

  async signup() {
    await this.storage.set('tutorialComplete', true);
    this.control.navCtrl.setDirection('root');
    this.control.navCtrl.navigateRoot('/signup');
  }







}
