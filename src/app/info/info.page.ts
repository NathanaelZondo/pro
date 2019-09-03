import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(public control:ControlsService) { }

  ngOnInit() {
  }

  goback(){
    
  }

  back(){
    this.control.router.navigate(['navigation']);
  }

}
