import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ControlsService } from '../controls.service';
import {storage} from 'firebase';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
})
export class UpdateprofilePage implements OnInit {
profiles =[];
name;surname;image;about;cell;uid;
  constructor(private camera:Camera,public control:ControlsService,public backend:BackendService) { 

    this.backend.getprofile2().then(res=>{
    //  res.data()
     this.profiles.push(res.data())
    
     this.profile.name=this.profiles[0].name;
     this.profile.surname=this.profiles[0].surname;
     this.profile.cell=this.profiles[0].cell;
     this.profile.about =this.profiles[0].about;
     this.profile.image =this.profiles[0].image;
     console.log("Dis d name",this.profile)
    })
      

   
}
  profile:Profile = {
name:this.name,
surname:this.surname,
cell:this.cell,
about:this.about,
image:this.image
 }
  ngOnInit() {

    console.log()
  }

picurl;

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
