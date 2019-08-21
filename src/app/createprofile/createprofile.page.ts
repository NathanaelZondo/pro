import { Component } from '@angular/core';
import {storage,initializeApp} from 'firebase';
import { config } from '../cred';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Profile } from '../profile';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';



@Component({
  selector: 'app-createprofile',
  templateUrl: './createprofile.page.html',
  styleUrls: ['./createprofile.page.scss'],
})

export class CreateprofilePage  {

  profiles =[];
  constructor(private camera:Camera,public control:ControlsService,public backend:BackendService) {


  }

  ngOnInit() {
  }

picurl;

profile:Profile = {
  name:"",
  surname:"",
  cell:0,
  about:"",
  image:""
}

saveprofile(profile)
{
  profile.image = ""; //this.picurl;
console.log(profile)

this.backend.createprofile(profile);
this.control.router.navigate(['home']);


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
  this.picurl = val;
})

  }

}






 

  
