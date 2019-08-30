import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import * as firebase from 'firebase';
import { snapshotChanges } from '@angular/fire/database';
declare var google
@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
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
db = firebase.firestore();

geoAccuracy: number;
geoAddress: string;
showAutoHideLoader : any;
  constructor(public alertCtrl: AlertController, private geolocation: Geolocation,public loadingController: LoadingController) {

    this.db.collection('D').onSnapshot(snapshot => {
      snapshot.forEach(doc => {
   
        this.users.push(doc.data());
        console.log('Retrive messege:',this.users); 
        //this.addMarkersOnTheCustomersCurrentLocation();

        this.users.forEach(Customers => {
      this.addMarkersOnTheCustomersCurrentLocation(Customers.coords.lat, Customers.coords.lng);
      // Customers.coords.lat, Customers.coords.lng
      console.log('coordsdddd', Customers);
      
     }) 


      })

    
    });
  
    // this.users.forEach(Customers => {
    //   this.addMarkersOnTheCustomersCurrentLocation(Customers.coords.lat, Customers.coords.lng);

    //  }) 

    

   }

  ngOnInit() {
    // this.addMarkersOnTheCustomersCurrentLocation();
  
  }
  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.mapElement, marker);
    });
  }

  // addMarkersOnTheCustomersCurrentLocation(lat, lng){

  //   let marker = new google.maps.Marker({
  //       map: this.map,
  //       animation: google.maps.Animation.DROP,
  //       position: new google.maps.LatLng(lat, lng),
  //   });
  //   let content = "<p>Customer's Location!</p>";          
  //   this.addInfoWindow(marker, content);
  // }

  
  addMarkersOnTheCustomersCurrentLocation(lat, lng){


    
    let marker = new google.maps.Marker({
        map: this.mapElement,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(lat, lng),
    });
    let content = "<p>Salon's location!</p>";          
    this.addInfoWindow(marker, content);
    
    console.log('addMarkersOnTheCustomersCurrentLocation called');
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
    // this.getSalon();
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
        console.log(resp);
        
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

        const markers = {
          coords: {
            lat: this.obj.lat,
          lng: this.obj.lng
          }
        }
        
        this.infoWindow.setPosition(this.mapCenter);
        this.infoWindow.open(this.mapElement);
        this.initMap();
        this.addMarker(marker);
        // this.addMarke(markers);
        
       }).catch((error) => {
         alert('Error getting location'+ JSON.stringify(error));
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

    obj = {
      lat : -26.1562825,
      lng : 27.7639596
    }
       
    addMarke(props) {
  
      const marker = new google.maps.Marker({
        position: props.coords,
        map: this.mapElement,
      })
   
     
    
       let infoWindow = new google.maps.InfoWindow({
       
       });
       marker.addListener('click', () => {
        infoWindow.open(this.mapElement, marker);
       })
     
    }

   
    addMarker(props) {
  
      const marker = new google.maps.Marker({
        position: props.coords,
        map: this.mapElement,
      })
   
      if(props.iconImage) {
       
        marker.setIcon(props.iconImage)
      }
 
      if(props.content) {
    
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

    getSalon(){
this.db.collection('SalonOwnerProfile').get().then( res =>{res.forEach(doc =>{
  console.log(doc.data());
})
})
    }
}
