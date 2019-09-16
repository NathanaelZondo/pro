import { Component, OnInit, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { ViewChild, ElementRef } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import * as firebase from 'firebase';

import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';

// import undefined = require('firebase/empty-import');
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import { ControlsService } from '../controls.service';




declare var google;
@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  // toggles the div, goes up if true, goes down if false
  display = false;
  swipeUp() {
    this.display = !this.display;
  }
  options: GeolocationOptions;
  currentPos: Geoposition;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  db = firebase.firestore();
  users = [];
  map: any;
  latitude: number;
  longitude: number;
  NewUseArray = {};
  schools = [];
  requests = [];
  NewRequeste = [];
/// nathaneal declarations
hairstyledata: Array<any> = [];
salon = [];
profiles: Profile[];
cover;
desc;
location;
salonname;
salond = this.backend.salonsDisply;
  constructor(private ngZone: NgZone,private geolocation: Geolocation, public alertController: AlertController, public router: Router, private nativeGeocoder: NativeGeocoder, public loadingController: LoadingController, public backend: BackendService, public control: ControlsService,private platform: Platform) {
   ////////get salons
   

   this.backend.getsalons().subscribe(val => {
    this.salon = val;
    console.log(this.salon)


  

    this.hairstyledata = this.backend.hairstyledata.splice(0, this.backend.hairstyledata.length);

    this.backend.setsalondata(this.salonname, this.location)
    this.backend.getHairSalon()

  })

  this.backend.getProfile().subscribe(val => {


    this.profiles = this.backend.profiles;





    this.backend.setuserdata(this.profiles[0].name, this.profiles[0].surname, this.profiles[0].cell)


    console.log("this is the value for profile")

  })



   ///////////////////////////


  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Added to booking list.',
      subHeader: '',
      message: '',
      buttons: ['OK']
    });

    await alert.present();
  }
  

  selectsalon(x) {

    this.backend.selectedsalon.splice(0, 1);
    console.log(x.userUID)
    this.cover = x.salonImage;
    this.desc = x.SalonDesc;
    this.location = x.streetName;
    this.backend.salonname = x.salonName;
    this.backend.selectedsalon.push(x);
    this.backend.selectedsalon.splice(1, 1);
    this.backend.setsalondata(x.salonName, x.streetName);

    let click = 1;
    let v1;
    let docid;

    this.backend.salonuid = x.userUID;
    firebase.firestore().collection('salonAnalytics').doc(x.userUID).collection('numbers').get().then(val => {
      console.log("These are the numbers", val)
      val.forEach(qu => {
        docid = qu.id;
        console.log(docid)
        console.log(qu.data().numberofclicks)
        v1 = qu.data().numberofclicks;

        firebase.firestore().collection('salonAnalytics').doc(x.userUID).collection('numbers').doc(qu.id).update({ "numberofclicks": v1 + click }).then(zet => {
          console.log(zet)
        })
      }
      )
    })
    this.control.router.navigate(['viewsalon']);
  }

  ngOnInit() {
    this.platform.ready().then(() =>{
      this.getUserPosition();
  
    })
    this.loadingController.create({
      message: 'Please wait',
      duration: 2000
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed! after 2 Seconds');
      });
    });
   
    
  }

  

  addInfoWindows(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.mapElement, marker);
    });
  }

  getUserPosition() {
    this.options = {
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {

      this.currentPos = pos;
      console.log(pos);
      this.addMap(pos.coords.latitude, pos.coords.longitude);
      console.log('Current Location', pos);
      this.addMarker();
    }, (err: PositionError) => {
      console.log("error : " + err.message);
    });
    
  }

getSalonmarkrs(){
  this.db.collection('SalonNode').onSnapshot(snapshot => {
    snapshot.forEach(doc => {

     
        let content = '<b>Salon Name : ' + doc.data().salonName + '<br>' + 'SALON CONTACT NO:' + doc.data().SalonContactNo + '<br>' + 'SALON ADDRESS: ' + doc.data().location
        //  this.addMarkersOnTheCustomersCurrentLocation(doc.data().lat, doc.data().lng, content);



         const icon = {
          url: '../../assets/icon/58889201bc2fc2ef3a1860a7.png', // image url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
    
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(doc.data().lat, doc.data().lng),
          icon: icon
        });
        // this.addInfoWindow(marker, content);
        marker.setMap(this.map);
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });
    
        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
        });


        console.log('cords',doc.data().lat,doc.data().lng);
        

    })
  }); 
}

  addMap(lat: number, long: number) {
    let latLng = new google.maps.LatLng(lat, long);
    var grayStyles = [
      {
        featureType: "all",
        stylers: [
          { saturation: -10 },
          { lightness: 0 }
        ]
      },
    ];

    let mapOptions = {
      center: latLng,
      zoom: 10,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: grayStyles
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
this.getSalonmarkrs();
     ////////////////////////////////////////////////////////////////////////////////////////////////////
     let input = document.getElementById('pac-input');
     let searchBox = new google.maps.places.SearchBox(input);
     this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
 
     // Bias the SearchBox results towards current map's viewport.
     this.map.addListener('bounds_changed', (res) => {
       searchBox.setBounds(this.map.getBounds());
     });
     let markers = [];
     // Listen for the event fired when the user selects a prediction and retrieve
     // more details for that place.
     searchBox.addListener('places_changed', (res) => {
       let places = searchBox.getPlaces();
 
       if (places.length == 0) {
         return;
       }
 
       // Clear out the old markers.
       markers.forEach((marker) => {
         marker.setMap(null);
       });
       markers = [];
 
       // For each place, get the icon, name and location.
       let bounds = new google.maps.LatLngBounds();
       places.forEach((place) =>{
         if (!place.geometry) {
           console.log("Returned place contains no geometry");
           return;
         }
         let icon = {
           url: place.icon,
           size: new google.maps.Size(71, 71),
           origin: new google.maps.Point(0, 0),
           anchor: new google.maps.Point(17, 34),
           scaledSize: new google.maps.Size(25, 25)
         };
 
         // Create a marker for each place.
         markers.push(new google.maps.Marker({
           map: this.map,
           icon: icon,
           title: place.name,
           position: place.geometry.location
         }));
 
         if (place.geometry.viewport) {
           // Only geocodes have viewport.
           bounds.union(place.geometry.viewport);
         } else {
           bounds.extend(place.geometry.location);
         }
       });
       this.map.fitBounds(bounds);
     });
  }

  //=====================

  loadMap() {
    let latLng = new google.maps.LatLng(48.8513735, 2.3861292);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var locations = [
      ['Bondi Beach', -33.890542, 151.274856, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: this.map
      });

      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          infowindow.setContent(locations[i][0]);
          infowindow.open(this.map, marker);
        }
      })(marker, i));
    }
  }

  //==============================
  //addMarkers method adds the customer's location 
  addMarkersOnTheCustomersCurrentLocation(lat, lng, content) {
    console.log('Called ');
    const icon = {
      url: '../../assets/icon/58889201bc2fc2ef3a1860a7.png', // image url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, lng),
      icon: icon
    });
    this.addInfoWindow(marker, content);

}


  //getGeolocation method gets the surrent location of the device
  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
    
    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  //addMarker method adds the marker on the on the current location of the device
  addMarker() {

    //here
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<p>Your current location!</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
  goToProfile() {
    this.router.navigate(['profile']);
  }
}
