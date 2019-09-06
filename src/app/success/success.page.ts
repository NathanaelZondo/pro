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
  }


success()
{
  this.control.router.navigateByUrl('/navigation');  
}

}
