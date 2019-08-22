import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-viewsalon',
  templateUrl: './viewsalon.page.html',
  styleUrls: ['./viewsalon.page.scss'],
})
export class ViewsalonPage implements OnInit {
  hairstyledata:Array<any>=[];
  constructor(public control:ControlsService,public backend:BackendService) {
    this.backend.getHairSalon();

    this.hairstyledata =this.backend.hairstyledata;
   }

  ngOnInit() {
  }
gender =0;
  selecthairstyle(x)
  {
    this.gender = x;
    if(x == 'male')
    {
      this.backend.getstyles(0);
    //this.control.router.navigate(['viewhairstyle']);
  }
else{
 this.backend.getstyles(1);
  //this.control.router.navigate(['viewhairstyle']);
}
  }}
