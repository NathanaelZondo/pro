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

 
   }

  ionViewDidEnter()
{
  this.backend.getstyles(this.backend.gend).subscribe(val=>{
    this.fg =val;
this.gender.push(this.fg);

this.backend.sethairstyledata(this.gender[0].hairstyle,this.gender[0].duration,this.gender[0].hairprice);


console.log(this.gender[0].duration)
  })
}

  ngOnInit() {
  }
  selectstyle()
  {
    this.control.router.navigate(['bookwithsalon']);
  }
}
