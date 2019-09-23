import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {

  constructor(public control:ControlsService) { }

  ngOnInit() {
  }

  pickdates() {
    this.control.router.navigate(['dates']);
  }
}
