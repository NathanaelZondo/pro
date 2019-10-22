import { Component } from '@angular/core';
import {storage,initializeApp} from 'firebase';
import { config } from '../cred';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Profile } from '../profile';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import * as firebase from 'firebase';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { async } from 'q';
import { OneSignal } from '@ionic-native/onesignal/ngx';




@Component({
  selector: 'app-createprofile',
  templateUrl: './createprofile.page.html',
  styleUrls: ['./createprofile.page.scss'],
})

export class CreateprofilePage  {
  hide='';
  storage = firebase.storage().ref();
  uploadprogress
  profiles =[];
  isuploading: false
tokenRe
profile = {
  name: '',
  surname: '',
  cell:'',
  about: '',
  image: '',
  TokenID:undefined
}
myid =[];
  constructor(private navCtrl:NavController,public loadingController:LoadingController,public toastController:ToastController,private camera:Camera,public control:ControlsService,public backend:BackendService, private oneSignal: OneSignal,) {
    this.oneSignal.getIds().then((res) => {
      this.profile.TokenID = res.userId
      console.log('check', this.profile.TokenID);
           // (Output) OneSignal User ID: 270a35cd-4dda-4b3f-b04e-41d7463a2316    
         });
    console.log(this.myid)
      
  }

  ngOnInit() {
  
  }

picurl;
styleImage 


saveprofile(profile)
{
   //this.picurl;
console.log(profile)

if(profile.name =="" ||profile.name ==undefined)
{
 console.log("entername") 
 this.nameToast();
}
else if(profile.surname=="" ||profile.surname ==undefined){
  console.log("entersurname")
  this.surnameToast(); 
}
else if(profile.about=="" ||profile.about ==undefined){
  console.log("enterabout")
   this.bioToast();
}
else if((profile.cell.length)!=10 ||profile.cell ==undefined){
  console.log("entercell")
  this.cellToast(); 
}
else if(profile.image=="" || profile.image ==undefined)
{
 this.imageToast() 
}
else{

  firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).set(this.profile);
this.control.newprofileToast();
  this.control.navCtrl.navigateRoot('/navigation');
}
}

message:String ="No image uploaded.";
  async takePhoto()
  {
const options:CameraOptions ={

  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE,
  quality: 90,
  targetHeight : 600,
  targetWidth : 600,
  correctOrientation: true,
  sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
}

await this.camera.getPicture(options).then(res => {
  console.log(res);
  const image = `data:image/jpeg;base64,${res}`;

  this.styleImage = image;
  const filename = Math.floor(Date.now() / 1000);
  let file = 'Userprofiles/' + firebase.auth().currentUser + '.jpg';
  const UserImage = this.storage.child(file);
  
  const upload = UserImage.putString(image, 'data_url');
  upload.on('state_changed', snapshot => {
    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    this.uploadprogress = progress;
 
    if (progress == 100) {
      this.isuploading = false;
    }
  }, err => {
  }, () => {
    upload.snapshot.ref.getDownloadURL().then(downUrl => {
      this.profile.image = downUrl;
      
      console.log('Image downUrl', downUrl);

if(downUrl=="" || downUrl ==undefined)
{
 this.message ="No image uploaded" 
}
else{
  this.message ="Profile image uploaded successfully" 
}
    })
  })
}, err => {
  console.log("Something went wrong: ", err);
})


  }


  async nameToast() {
    const toast = await this.toastController.create({
      message: 'Enter your name.',
      duration: 5000
    });
    toast.present();
  }


  async surnameToast() {
    const toast = await this.toastController.create({
      message: 'Enter your surname.',
      duration: 5000
    });
    toast.present();
  }

  async cellToast() {
    const toast = await this.toastController.create({
      message: 'Enter a 10 digit phone number.',
      duration: 5000
    });
    toast.present();
  }

  async imageToast() {
    const toast = await this.toastController.create({
      message: 'Select an image from your gallery.',
      duration: 5000
    });
    toast.present();
  }
  async bioToast() {
    const toast = await this.toastController.create({
      message: 'Tell us about yourself.',
      duration: 5000
    });
    toast.present();
  }




  async imageLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait image uploading...',
      translucent: true,
      duration: 20000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  signout() {
    this.backend.signout();

    this.navCtrl.setDirection('root');
    this.navCtrl.navigateRoot('/login');
  }
  inputEvent(data){

    if(data=='open'){
       this.hide='value'
    } else if(data=='close') {
      this.hide='';
    }
    
  }

//   async createprofile(profileForm: FormGroup): Promise<void> {
//     if (!profileForm.valid) {
//       console.log(
//         'Need to complete the form, current value: ',
//         profileForm.value
//       );
//     } else {
//            // load the profile creation process
//          const load =    await this.loadingController.create({
//             message: 'Creating Profile..'
//           });
//      load.present();
      
//       //const user = this.db.collection('SalonOwnerProfile').doc(this.authUser.getUser()).update(this.SalonOwnerProfile);

//         firebase.firestore().collection('userprofile').doc(firebase.auth().currentUser.uid).set(this.Profile);
// this.control.newprofileToast();
//   this.control.navCtrl.navigateRoot('/navigation');
//        const toast = await this.toastController.create({
//           message: 'Welcome' ,
//           duration: 2000,
       
//         });
//         toast.present();
//         // ...get the profile that just got created...
//         load.dismiss();
      
//         // catch any errors.
//       }
//     }
    
  // validation_messages = {
  //   'ownername': [
  //     { type: 'required', message: 'Name is required.' },
  //     { type: 'minlength', message: 'Name must be at least 4 characters long.' },
  //     { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
  //     { type: 'pattern', message: 'Your Name must not contain numbers and special characters.' },
  //     { type: 'validUsername', message: 'Your username has already been taken.' }
  //   ],
  //   'ownerSurname': [
  //     { type: 'required', message: 'Surname is required.' },
  //     { type: 'minlength', message: 'Surname must be at least 4 characters long.' },
  //     { type: 'maxlength', message: 'Surname cannot be more than 25 characters long.' },
  //     { type: 'pattern', message: 'Your Surname must not contain numbers and special characters.' },
  //     { type: 'validUsername', message: 'Your username has already been taken.' }
  //   ],
  //   'phone': [
  //     { type: 'required', message: 'Cellnumber is required.' }
  //   ],
    
  // };
  }















 

  
