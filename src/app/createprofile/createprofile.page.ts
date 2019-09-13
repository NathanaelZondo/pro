import { Component } from '@angular/core';
import {storage,initializeApp} from 'firebase';
import { config } from '../cred';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Profile } from '../profile';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import * as firebase from 'firebase';
import { ToastController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-createprofile',
  templateUrl: './createprofile.page.html',
  styleUrls: ['./createprofile.page.scss'],
})

export class CreateprofilePage  {
  storage = firebase.storage().ref();
  uploadprogress
  profiles =[];
  isuploading: false
  constructor(public loadingController:LoadingController,public toastController:ToastController,private camera:Camera,public control:ControlsService,public backend:BackendService) {


  }

  ngOnInit() {
  }

picurl;
styleImage 
profile:Profile = {
  name:"",
  surname:"",
  cell:"",
  about:"",
  image:""
}

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
else if(profile.cell=="" ||profile.cell ==undefined){
  console.log("entercell")
  this.cellToast(); 
}
else if(profile.image=="" || profile.image ==undefined)
{
 this.imageToast() 
}
else{
 
  firebase.firestore().collection('userprofile').doc(firebase.auth().currentUser.uid).set(profile);


  this.control.navCtrl.navigateRoot('/navigation');
}
}


  async takePhoto()
  {
const options:CameraOptions ={
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE,
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
this.imageLoading();

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
      message: 'Enter your cell phone number.',
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
      message: 'Please wait...',
      translucent: true,
      duration: 20000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }











}






 

  
