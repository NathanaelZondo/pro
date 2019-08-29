import { Component, ViewChild, ElementRef } from '@angular/core';
import {storage,initializeApp} from 'firebase';
import { config } from '../cred';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ControlContainer } from '@angular/forms';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
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
//MAPS DECLARATION
@ViewChild("map", { static: false }) mapElement: ElementRef ;
infoWindow = new google.maps.InfoWindow;
map: any;
bounds = {
  north: -21.914461,
  south: -35.800139,
  west: 15.905430,
  east: 34.899504
}
users = []
mapCenter = {
  lat: 0,
  lng: 0
}
// db = firebase.firestore();

geoAccuracy: number;
geoAddress: string;
showAutoHideLoader : any;
//OTHER DECLARATIONS
  hairstyledata:Array<any>=[];
  salon=[];
profiles:Profile[];
cover;
desc;
location;
salonname;
salond =this.backend.salonsDisply;
  constructor(private camera:Camera,public control:ControlsService,public backend:BackendService,public alertCtrl: AlertController,private geolocation: Geolocation,public loadingController: LoadingController) {
   // initializeApp(config);
   this.backend.authstate();
console.log('check',this.salond)
   this.backend.getsalons().subscribe(val=>{
    this.salon =val;
    console.log(this.salon)


//view profile on the viewprofilepage 
    this.backend.viewprofile();


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


//   signout()
//   {
// this.backend.signout();
// this.control.router.navigate(['login']);
//   }

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

  chec(){
    this.control.router.navigate(['maps']);
  }
  viewprofile()
  {
    this.control.router.navigate(['viewprofile']);
  }
  ionViewDidEnter(){
    console.log('check');
  
      this.loadingController.create({
        message: 'This Loader Will Auto Hide in 2 Seconds',
        duration: 2000
      }).then((res) => {
        res.present();
   
        res.onDidDismiss().then((dis) => {
          console.log('Loading dismissed! after 2 Seconds');
        });
      });
    
    this.getGeolocation();
   
  }

    ///MAPS \
    setlocation(coords) {
      console.log(coords);
      
      this.infoWindow.setPosition(coords);
    }
    getGeolocation(){
      this.geolocation.getCurrentPosition().then((resp) => {
        // this.geoLatitude = resp.coords.latitude;
        // this.geoLongitude = resp.coords.longitude; 
        // this.geoAccuracy = resp.coords.accuracy; 
        // this.getGeoencoder(this.geoLatitude,this.geoLongitude);
        this.mapCenter.lat = resp.coords.latitude;
        this.mapCenter.lng = resp.coords.longitude;
        this.geoAccuracy = resp.coords.accuracy;
  
        const marker = {
          coords: {
            lat: resp.coords.latitude,
          lng: resp.coords.longitude
          },
          content: 'ME',
          name: ''
        }
        
        this.infoWindow.setPosition(this.mapCenter);
        this.infoWindow.open(this.mapElement);
        this.initMap();
        this.addMarker(marker);
       }).catch((error) => {
         alert('Error getting location'+ JSON.stringify(error));
       });
       firebase.firestore().collection('SalonOwnerProfile').get().then((res)=>{
      
        res.forEach((doc)=> {
        
          console.log(doc.data().address.longitude);
          let lat = doc.id +"<br>Salon name: "+ doc.data().ownername+ " yebo" + doc.data().price;
          let coord = new google.maps.LatLng(doc.data().address.latitude, doc.data().address.longitude);
           let marker = new google.maps.Marker({
               map: this.map,
               position: coord,
               title: 'Click to view details',
             })
                  let infoWindow = new google.maps.InfoWindow({
              content: lat
         });
         google.maps.event.addListener(marker, 'click', (resp)=>{
          infoWindow.open(this.map, marker)
          })
          google.maps.event.addListener( marker,'click', (resp) => {
            this.map.setZoom(15);
            this.map.setCenter(marker.getPosition());
          });
       
        })
       
      
        // }
      });
    }
  
    mapOptions() {
      
      let mapOptions =  google.maps.MapOptions = {
        center: this.mapCenter,
        disableDefaultUI: true, 
        minZoom: 10,
        maxZoom: 17,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        restriction: {
          latLngBounds: this.bounds,
          strictBounds: false
        }
      }
      return mapOptions;
    }
    initMap(){
     
      this.mapElement = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions());
    }
   
    addMarker(props) {
      // add marker
      const marker = new google.maps.Marker({
        position: props.coords,
        map: this.mapElement,
      })
      // check for custom icon
      if(props.iconImage) {
        // set custom icon
        marker.setIcon(props.iconImage)
      }
  
      // check for content
      if(props.content) {
        // set custom content
       let infoWindow = new google.maps.InfoWindow({
         content: `<h5 style="margin:0;padding:0;">${props.name} </h5>`+props.content
       });
       marker.addListener('click', () => {
        infoWindow.open(this.mapElement, marker);
       })
      }
    }
    handleLoacationError (content, position) {
      this.infoWindow.setOptions(position);
      this.infoWindow.setContent(content);
      this.infoWindow.open(this.mapElement)
    }
 
}
