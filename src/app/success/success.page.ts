import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {

  constructor(public control:ControlsService) { }

  ngOnInit() {
    this.control.Loading();
  }


success()
{
  this.control.navCtrl.setDirection('root');
    this.control.navCtrl.navigateRoot('/login'); 
}

}
