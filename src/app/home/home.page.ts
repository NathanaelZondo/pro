import { Component } from '@angular/core';
import {storage,initializeApp} from 'firebase';
import { config } from '../cred';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ControlContainer } from '@angular/forms';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  salon=[];
profiles:Profile[];
cover;
desc;
location;
salonname;
salond =this.backend.salonsDisply;
  constructor(private camera:Camera,public control:ControlsService,public backend:BackendService) {
   // initializeApp(config);
   this.backend.authstate();
console.log('check',this.salond)
   this.backend.getsalons().subscribe(val=>{
    this.salon =val;
    console.log(this.salon)



this.backend.setsalondata(this.salonname,this.location)
this.backend.getHairSalon()
    
  })

  this.backend.getProfile().subscribe(val=>{
    

    this.profiles =val;

    
    
    
    
this.backend.setuserdata(this.profiles[0].name,this.profiles[0].surname,this.profiles[0].cell)


    console.log("this is the value for profile",)
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

  selectsalon(x)
  {
    console.log(this.backend.getsalons());

console.log(x)
this.cover =x.salonImage;
this.desc = x.SalonDesc;
this.location =x.location;
this.backend.salonname=x.salonName;

console.log(this.backend.salonname)
    this.control.router.navigate(['viewsalon']);
  }
}
