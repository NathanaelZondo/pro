import { Component } from '@angular/core';
import {storage,initializeApp} from 'firebase';
import { config } from '../cred';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ControlContainer } from '@angular/forms';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  hairstyledata:Array<any>=[];
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
   
    this.hairstyledata =this.backend.hairstyledata.splice(0,this.backend.hairstyledata.length);

this.backend.setsalondata(this.salonname,this.location)
this.backend.getHairSalon()
    
  })

  this.backend.getProfile().subscribe(val=>{
    

    this.profiles =val;

    
    
    
    
this.backend.setuserdata(this.profiles[0].name,this.profiles[0].surname,this.profiles[0].cell)


    console.log("this is the value for profile",)
  })
  }
  db = firebase.firestore();
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
  
this.backend.selectedsalon.splice(0,1);
console.log(x)
this.cover =x.salonImage;
this.desc = x.SalonDesc;
this.location =x.location;
this.backend.salonname=x.salonName;
this.backend.selectedsalon.push(x);
this.backend.selectedsalon.splice(1,1);




this.backend.setsalondata(x.salonName,x.location);



    this.control.router.navigate(['viewsalon']);
  }

  viewprofile()
  {
    this.control.router.navigate(['viewprofile']);
  }
  
}
