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
profiles:Profile[];
  constructor(public backend:BackendService, public control:ControlsService) { 

    this.backend.getProfile().subscribe(val=>{
      console.log(val)

      this.profiles =val;
      console.log("This is de profile " ,val)
    })
  }

  ngOnInit() {
  }


  update()
  {
    this.control.router.navigate(['updateprofile']);
  }

}
