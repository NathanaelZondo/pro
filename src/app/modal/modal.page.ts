import { Component, OnInit } from '@angular/core';
import { ViewController } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  timeList:Array<{}>
  constructor(private modalController: ModalController,public backend:BackendService) { 
this.timeList=this.backend.timeList;

console.log(this.timeList)

  }

  ngOnInit() {
  }

  
  async closemod()
  {
    this.backend.timeList=[];
    await this.modalController.dismiss();
  }

}
