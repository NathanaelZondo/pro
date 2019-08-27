import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.page.html',
  styleUrls: ['./viewprofile.page.scss'],
})
export class ViewprofilePage implements OnInit {
profiles =[];
  constructor(public backend:BackendService, public control:ControlsService) { 

    

      this.profiles.push(this.backend.profiles);
     
    console.log("look here !!!",this.backend.profiles)
  }

  ngOnInit() {
  }


  update()
  {
    this.control.router.navigate(['updateprofile']);
  }

}
