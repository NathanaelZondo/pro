import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-zero',
  templateUrl: './zero.page.html',
  styleUrls: ['./zero.page.scss'],
})
export class ZeroPage implements OnInit {
  staffnames =[];
  constructor(public popoverController:PopoverController,public control:ControlsService,public router:Router,public backend:BackendService) { }

  ngOnInit() {
    this.staffnames =[];
    this.staffnames=this.backend.staffnames;
    
console.log( this.staffnames)
  }


  select(x)
  {
    console.log(x)
    this.popoverController.dismiss(x);
  }

}
