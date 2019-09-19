import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-viewhairstyle',
  templateUrl: './viewhairstyle.page.html',
  styleUrls: ['./viewhairstyle.page.scss'],
})
export class ViewhairstylePage implements OnInit {
  gender=[];
  fg ={};
  hairstyledata:Array<any>=[];
  constructor(public backend:BackendService,public control:ControlsService) {

    this.backend.getHairSalon();
    

    this.hairstyledata =this.backend.hairstyledata;
   }

  ionViewDidEnter()
{
 
}

  ngOnInit() {
  }
  selectstyle()
  {
    this.control.router.navigate(['bookwithsalon']);
  }
}
