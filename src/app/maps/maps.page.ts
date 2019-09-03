import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import * as firebase from 'firebase';
import { snapshotChanges } from '@angular/fire/database';
import { Button } from 'protractor';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {Marker, Geocoder} from '@ionic-native/google-maps';
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
private googleAutoComplete = new google.maps.places.AutocompleteService();
public searchResults = new Array<any>();
public search : string ='';
private originMarker : Marker;
public destination : any;
 geocoder = new google.maps.Geocoder;
bounds = {
  north: -21.914461,
  south: -35.800139,
  west: 15.905430,
  east: 34.899504
}

users = []
mark = []
mapCenter = {
  lat: 0,
  lng: 0
}
db = firebase.firestore();

geoAccuracy: number;
geoAddress: string;
showAutoHideLoader : any;
  salonName: any;
  sname: any;
  constructor(public alertCtrl: AlertController, private geolocation: Geolocation,public loadingController: LoadingController, private router : Router,private ngZone : NgZone) {
console.log(google);

    this.db.collection('SalonNode').onSnapshot(snapshot => {
      snapshot.forEach(doc => {
   
        this.users.push(doc.data());
        console.log('Retrive messege:',this.users); 
        this.users.forEach(Customers => {
          const icon = {
            url: '../../assets/icon/salon.png', // image url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
          };
          
          let marker = new google.maps.Marker({
              map: this.mapElement,
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(Customers.coords.lat, Customers.coords.lng),
              icon: icon
              
          });
          let content = 'Salon Name' + Customers.salonName + '<br>' + Customers.SalonContactNo + '<br>' + '<button (click)="move()" size="small"  color="secondary">View more</button>'
          this.addInfoWindow(marker, content);
      // Customers.coords.lat, Customers.coords.lng
      console.log('coordsdddd', Customers);
     }) 
      })
    });
   }
   
move(){
  this.router.navigateByUrl('navigation');
// this.router.navigate(['navigation']);
console.log('checkl')
}
searchChanged(){
 if(!this.search.trim().length) return;
  this.googleAutoComplete.getPlacePredictions({ input: this.search}, predictions =>{
    //console.log(predictions);
    this.ngZone.run(() =>{
      this.searchResults = predictions;
    });
  });
}
async calcRoute(item:any){
  this.search = ''  
  this.destination = item;
  const info: any = await Geocoder.geocode({address: this.destination.description});
  console.log('mama',info);
  
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

   v : string = 'sdfdfgd';
  addMarkersOnTheCustomersCurrentLocation(lat, lng){

    const icon = {
      url: '../../assets/icon/salon.png', // image url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    
    let marker = new google.maps.Marker({
        map: this.mapElement,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(lat, lng),
        icon: icon
    });
this.db.collection('SalonNode').get().then(snap =>{
  snap.forEach(doc =>{
    this.mark.push(doc.data())
    this.mark.forEach(Cus =>{
      this.sname = Cus.salonName;
    })
    let content = ' ' +  this.sname 


    this.addInfoWindow(marker, content);
  })
})
           
   
    
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
        console.log(resp);   
        this.mapCenter.lat = resp.coords.latitude;
        this.mapCenter.lng = resp.coords.longitude;
        this.geoAccuracy = resp.coords.accuracy;
        const contentString = '<div id="content"> ' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
        '<div id="bodyContent">' +
        '<img src="assets/icon/user.png" width="200">' +
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the ' +
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
        'south west of the nearest large town, Alice Springs; 450&#160;km ' +
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
        'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
        'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
        'Aboriginal people of the area. It has many springs, waterholes, ' +
        'rock caves and ancient paintings. Uluru is listed as a World ' +
        'Heritage Site.</p>' +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
        '(last visited June 22, 2009).</p>' +
        '</div>' +
        '</div>';
        const marker = {
          coords: {
            lat: resp.coords.latitude,
          lng: resp.coords.longitude
          },
          content: contentString,
          name: 'My Current Location',
        
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
      const icon = {
        url: '../../assets/icon/u.png', // image url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };
      const marker = new google.maps.Marker({
        position: props.coords,
        map: this.mapElement,
        icon : icon
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
