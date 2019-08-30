import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {

  constructor(public backend:BackendService,public control:ControlsService) { }

  ngOnInit() {
    this.control.BookToast();
  }

}
