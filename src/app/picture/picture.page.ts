import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit {
 
  constructor(public backend:BackendService,public control:ControlsService) { }

  ngOnInit() {
  }
  hairStyleImage =this.backend.hairstyleimage;
}
