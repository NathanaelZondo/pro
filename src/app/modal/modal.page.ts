import { Component, OnInit } from '@angular/core';
import { ViewController } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  bookingdetails:Array<{}>
  constructor(private modalController: ModalController,public backend:BackendService,public control:ControlsService) { 
this.bookingdetails=this.backend.bookingdetails;

console.log(this.bookingdetails)

  }

  ngOnInit() {
   
  }

  
  async back()
  {
    
    await this.modalController.dismiss();
  }

  
}
