import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  constructor(public control:ControlsService,public router:Router) { }

  ngOnInit() {
  }


  home()
  {
  this.router.navigate([('home')]);  
  }
  map()
  {

this.router.navigate(['/maps']);
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

this.router.navigate(['info']);
  }


 

}
