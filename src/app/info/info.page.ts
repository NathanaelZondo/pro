import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  aboutUs=true;
disclaimer=true;
terms=true;
legal=true;


  constructor(public control:ControlsService) { }

  ngOnInit() {
  }

  goback(){
    
  }

  back(){
    this.control.router.navigate(['navigation']);
  }

  getAbout(){
    this.aboutUs=!this.aboutUs
  }

  getdisclaimer(){
    this.disclaimer=!this.disclaimer
  }

  getterms(){
    this.terms=!this.terms
  }

  getlegal(){
    this.legal=!this.legal
  }


}
