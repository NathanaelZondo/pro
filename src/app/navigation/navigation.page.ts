import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  constructor(public control:ControlsService,public router:Router, public backend: BackendService) { }

  ngOnInit() {
  }
  signout() {
    this.backend.signout();
    this.control.router.navigate(['login']);
  }

  home()
  {
  this.router.navigate([('home')]);  
  }
  map()
  {

this.router.navigate(['home']);
  }

  profile()
  {

this.router.navigate(['/viewprofile']);
  }

  bookings()
  {

this.router.navigate(['booking']);
  }

  info()
  {

this.router.navigate(['maps']);
  }


 

}
