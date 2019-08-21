import { Component } from '@angular/core';
import {storage,initializeApp} from 'firebase';
import { config } from '../cred';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ControlContainer } from '@angular/forms';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  salon=[];
 
cover;
desc;
location;
salonname;
  constructor(private camera:Camera,public control:ControlsService,public backend:BackendService) {
   // initializeApp(config);
   this.backend.authstate();

   this.backend.getsalons().subscribe(val=>{
    this.salon =val;
    console.log(this.salon)

this.cover =this.salon[0].coverImage;
this.desc = this.salon[0].desc;
this.location =this.salon[0].location;
this.salonname=this.salon[0].nameOfSalon;
    
  })
  }

  async takePhoto()
  {
const options:CameraOptions ={
  quality:50,
  targetHeight:600,
  targetWidth:600,
  destinationType:this.camera.DestinationType.DATA_URL,
  encodingType:this.camera.EncodingType.JPEG,
  mediaType:this.camera.MediaType.PICTURE
}

const result = await this.camera.getPicture(options);

const image =`data:image/jpeg;base64,${result}`;

const pictures = storage().ref('pictures');

pictures.putString(image,'data_url');

pictures.getDownloadURL().then(val=>{
  console.log(val)
})

  }


  signout()
  {
this.backend.signout();
this.control.router.navigate(['login']);
  }

  selectsalon()
  {
    console.log(this.backend.getsalons());
    this.control.router.navigate(['viewsalon']);
  }
}
