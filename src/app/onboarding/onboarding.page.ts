import { Component, OnInit , ViewChild} from '@angular/core';
import { ControlsService } from '../controls.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  constructor(public control:ControlsService,private storage: Storage) { }

  ngOnInit() {
  }
  async  signin() {
    await this.storage.set('tutorialComplete', true);
    this.control.router.navigate(['./']);
  }
 

 

}
