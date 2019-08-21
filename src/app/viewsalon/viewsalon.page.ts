import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-viewsalon',
  templateUrl: './viewsalon.page.html',
  styleUrls: ['./viewsalon.page.scss'],
})
export class ViewsalonPage implements OnInit {

  constructor(public control:ControlsService,public backend:BackendService) {

   }

  ngOnInit() {
  }

  selecthairstyle(x)
  {
    if(x==0)
    {
      this.backend.getstyles();
    this.control.router.navigate(['viewhairstyle']);
  }
else{
 // this.backend.getstyles();
  //this.control.router.navigate(['viewhairstyle']);
}
  }}
