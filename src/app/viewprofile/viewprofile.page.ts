import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.page.html',
  styleUrls: ['./viewprofile.page.scss'],
})
export class ViewprofilePage implements OnInit {
profiles:Profile[];
  constructor(public backend:BackendService) { 

    this.backend.getProfile().subscribe(val=>{
      console.log(val)

      this.profiles =val;
    })
  }

  ngOnInit() {
  }

}
