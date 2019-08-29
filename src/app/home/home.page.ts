import { Component, ViewChild, ElementRef } from '@angular/core';
import {storage,initializeApp} from 'firebase';
import { config } from '../cred';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ControlContainer } from '@angular/forms';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import * as firebase from 'firebase';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';
import { Router } from 'express';
declare var google
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //@ViewChild("map") mapElement;

//MAPS DECLARATION

//OTHER DECLARATIONS
  hairstyledata:Array<any>=[];
  salon=[];
profiles:Profile[];
cover;
desc;
location;
salonname;
salond =this.backend.salonsDisply;
  constructor(private camera:Camera,public control:ControlsService,public backend:BackendService,public alertCtrl: AlertController) {
   // initializeApp(config);
   this.backend.authstate();
console.log('check',this.salond)
   this.backend.getsalons().subscribe(val=>{
    this.salon =val;
    console.log(this.salon)
   
    this.hairstyledata =this.backend.hairstyledata.splice(0,1);

this.backend.setsalondata(this.salonname,this.location)
this.backend.getHairSalon()
    
  })

  this.backend.getProfile().subscribe(val=>{
    

    this.profiles =val;

    
    
    
    
this.backend.setuserdata(this.profiles[0].name,this.profiles[0].surname,this.profiles[0].cell)


    console.log("this is the value for profile",)
    
  })
  //this.getLocation();
  }


  // ///MAPS \
  // setlocation(coords) {
  //   console.log(coords);
    
  //   this.infoWindow.setPosition(coords);
  // }
  // getLocation(){
  //   // map options
  //   // get the device geo location or handle any errors
  //   this.geolocation.getCurrentPosition(res => {
  //     this.mapCenter.lat = res.coords.latitude;
  //     this.mapCenter.lng = res.coords.longitude;
  //     this.geoAccuracy = res.coords.accuracy;

  //     const marker = {
  //       coords: {
  //         lat: res.coords.latitude,
  //       lng: res.coords.longitude
  //       },
  //       content: 'You',
  //       name: ''
  //     }
      
  //     this.infoWindow.setPosition(this.mapCenter);
  //     this.infoWindow.open(this.mapElement);
  //     this.initMap();
  //     this.addMarker(marker);
  //   } , async err => {
  //     const alerter = await this.alertCtrl.create({
  //       message: 'Error getting location '+JSON.stringify(err)
  //     })
  //     alerter.present()
  //   })
  // }
  // mapOptions() {
    
  //   const mapOptions:  google.maps.MapOptions = {
  //     center: this.mapCenter,
  //     disableDefaultUI: true, 
  //     minZoom: 10,
  //     maxZoom: 17,
  //     zoom: 10,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //     restriction: {
  //       latLngBounds: this.bounds,
  //       strictBounds: false
  //     }
  //   }
  //   return mapOptions;
  // }
  // initMap(){
  //   // new map
  //   this.mapElement = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions());
  // }
  // // add marker function 
  // addMarker(props) {
  //   // add marker
  //   const marker = new google.maps.Marker({
  //     position: props.coords,
  //     map: this.mapElement,
  //   })
  //   // check for custom icon
  //   if(props.iconImage) {
  //     // set custom icon
  //     marker.setIcon(props.iconImage)
  //   }

  //   // check for content
  //   if(props.content) {
  //     // set custom content
  //    let infoWindow = new google.maps.InfoWindow({
  //      content: `<h5 style="margin:0;padding:0;">${props.name} </h5>`+props.content
  //    });
  //    marker.addListener('click', () => {
  //     infoWindow.open(this.mapElement, marker);
  //    })
  //   }
  // }
  // handleLoacationError (content, position) {
  //   this.infoWindow.setOptions(position);
  //   this.infoWindow.setContent(content);
  //   this.infoWindow.open(this.mapElement)
  // }

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
  

console.log(x)
this.cover =x.salonImage;
this.desc = x.SalonDesc;
this.location =x.location;
this.backend.salonname=x.salonName;
this.backend.selectedsalon.push(x);



this.backend.setsalondata(x.salonName,x.location);



    this.control.router.navigate(['viewsalon']);
  }

  chec(){
    this.control.router.navigate(['maps']);
  }
  
}
