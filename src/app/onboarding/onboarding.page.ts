import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  constructor(public control:ControlsService) { }

  ngOnInit() {
  }

  register()
  {

this.control.router.navigate(['signup']);
  }

  signin(){
    this.control.router.navigate(['login']);
  }

}
