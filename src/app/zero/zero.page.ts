import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zero',
  templateUrl: './zero.page.html',
  styleUrls: ['./zero.page.scss'],
})
export class ZeroPage implements OnInit {

  constructor(public control:ControlsService,public router:Router) { }

  ngOnInit() {
  }


  home()
  {
  this.router.navigate([('home')]);  
  }
  map()
  {

this.router.navigate(['maps']);
  }

  profile()
  {

this.router.navigate(['viewprofile']);
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
