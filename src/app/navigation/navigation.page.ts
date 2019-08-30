import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  constructor(public control:ControlsService) { }

  ngOnInit() {
  }

  map()
  {

this.control.router.navigate(['home']);
  }

  profile()
  {

this.control.router.navigate(['viewprofile']);
  }

  bookings()
  {

this.control.router.navigate(['booking']);
  }

//   info()
//   {

// this.control.router.navigate(['home']);
//   }

}
