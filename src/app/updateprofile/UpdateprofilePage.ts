import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ControlsService } from '../controls.service';
import * as firebase from 'firebase';
import { ToastController, LoadingController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
})
export class UpdateprofilePage implements OnInit {
  profiles = [];
  name;
  surname;
  image;
  about;
  tokenID
  cell;
  uid;
  sub = false;
  styleImage;
  message:string ="No image uploaded";
  storage = firebase.storage().ref();
  uploadprogress;
  isuploading: false;
  constructor(public toastController:ToastController,private camera: Camera, public control: ControlsService, public backend: BackendService,public loadingController:LoadingController,private oneSignal: OneSignal) {
    this.oneSignal.getIds().then((res) => {
  
      this.profile.TokenID = res.userId;
      })
  
    this.backend.getprofile2().then(res => {
      //  res.data()
      this.profiles.push(res.data());
      this.profile.name = this.profiles[0].name;
      this.profile.surname = this.profiles[0].surname;
      this.profile.cell = this.profiles[0].cell;
      this.profile.about = this.profiles[0].about;
      this.profile.image = this.profiles[0].image;
      this.profile.TokenID = this.profile[0].tokenID;
      console.log("Dis d name", this.profile);
    });
  }
  profile: Profile = {
    name: this.name,
    surname: this.surname,
    cell: this.cell,
    about: this.about,
    image: this.image,
    TokenID: ""
  };
  ngOnInit() {
    console.log();
  }
  picurl;
  async takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    };
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
        this.imageLoading();
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
          
        
        });
      });
    }, err => {
      console.log("Something went wrong: ", err);
    });
  }
  updateprofile(profile) 
  {

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
    else if((profile.cell.length) <10 ||profile.cell ==undefined){
      console.log("entercell")
      this.cellToast(); 
    }
    else
    {



      firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).update(profile).then(val => {
        console.log(val);
      });
      this.control.ProfileupdateToast();
  
      this.control.navCtrl.setDirection('root');
      this.control.navCtrl.navigateRoot('/navigation'); 
    
    }





    
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
      message: 'Enter a 10 digit cell phone number.',
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
      duration: 5000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

}
