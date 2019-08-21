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
  constructor(public backend:BackendService,public control:ControlsService) {

    this.backend.getstyles().subscribe(val=>{
      //this.fg = val;
this.gender.push(this.fg);

console.log(this.gender)
    })
   }

  ngOnInit() {
  }
  selectstyle()
  {
    this.control.router.navigate(['bookwithsalon']);
  }
}
