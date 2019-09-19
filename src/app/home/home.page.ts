import { Component, ViewChild, ElementRef, ɵDEFAULT_LOCALE_ID } from '@angular/core';
import { storage, initializeApp } from 'firebase';
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
import { Marker, GoogleMap } from '@ionic-native/google-maps';

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
  @ViewChild("map", { static: false }) mapElement: ElementRef;
  infoWindow = new google.maps.InfoWindow;
  map: any;
  private googleAutoComplete = new google.maps.places.AutocompleteService();
  public searchResults = new Array<any>();
  public search: string = '';
  private originMarker: Marker;
  public destination: any;
  private maps: GoogleMap;
  sname: any;
  mark = []
  geocoder = new google.maps.Geocoder;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
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
  showAutoHideLoader: any;
  //OTHER DECLARATIONS
  hairstyledata: Array<any> = [];
  salon = [];
  profiles: Profile[];
  cover;
  desc;
  location;
  salonname;
  salond = this.backend.salonsDisply;
  constructor(private nativeGeocoder: NativeGeocoder, private camera: Camera, public control: ControlsService, public backend: BackendService, public alertCtrl: AlertController, private geolocation: Geolocation, public loadingController: LoadingController) {
    // initializeApp(config);  

    

    ///maps
    this.db.collection('SalonNode').onSnapshot(snapshot => {
      snapshot.forEach(doc => {

        this.users.push(doc.data());
        console.log('Retrive messege:', this.users);
        this.users.forEach(Customers => {
          const icon = {
            url: '../../assets/icon/salon.png', // image url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
          };

          let marker = new google.maps.Marker({
            map: this.mapElement,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(Customers.coords.lat, Customers.coords.lng),
            icon: icon

          });
          let content = '<b>Salon Name : ' + Customers.salonName + '<br>' + 'SALON CONTACT NO:' + Customers.SalonContactNo + '<br>' + 'SALON ADDRESS: ' + Customers.location
          this.addInfoWindow(marker, content);
          // Customers.coords.lat, Customers.coords.lng
          console.log('coordsdddd', Customers);
        })
      })
    });
  }


  db = firebase.firestore();

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

  chec() {
    //this.control.router.navigate(['maps']);
  }
  viewprofile() {
    this.control.router.navigate(['viewprofile']);
  }
  ionViewDidEnter() {
    console.log('check');
    // this.control.router.navigate([('maps')]);
    //   this.loadingController.create({
    //     message: 'This Loader Will Auto Hide in 2 Seconds',
    //     duration: 2000
    //   }).then((res) => {
    //     res.present();

    //     res.onDidDismiss().then((dis) => {
    //       console.log('Loading dismissed! after 2 Seconds');
    //     });
    //   });

    this.getGeolocation();

  }

  searchChanged() {

    if (!this.search.trim().length) return;
    this.googleAutoComplete.getPlacePredictions({ input: this.search }, predictions => {
      //console.log(predictions);

      this.searchResults = predictions;

    });
  }
  async calcRoute(item: any) {
    this.search = ''
    this.destination = item;
    // const info: any = await Geocoder.geocode({address: this.destination.description});
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.forwardGeocode(this.destination.description, options).then((result: NativeGeocoderResult[]) => {
      console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude)
      let directions = {
        lat: result[0].latitude,
        lng: result[0].longitude
      }
      this.directionsService.route({
        origin: this.mapCenter,
        destination: directions,
        travelMode: 'DRIVING'
      }, (response, status) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });

      this.db.collection('values').add({
        lat: result[0].latitude,
        lng: result[0].longitude
      })
    })
      .catch((error: any) => console.log(error));
    console.log(this.destination.description);


  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.mapElement, marker);
    });
  }

  v: string = 'sdfdfgd';
  addMarkersOnTheCustomersCurrentLocation(lat, lng) {

    const icon = {
      url: '../../assets/icon/salon.png', // image url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };

    let marker = new google.maps.Marker({
      map: this.mapElement,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, lng),
      icon: icon
    });
    this.db.collection('SalonNode').get().then(snap => {
      snap.forEach(doc => {
        this.mark.push(doc.data())
        this.mark.forEach(Cus => {
          this.sname = Cus.salonName;
        })
        let content = ' ' + this.sname


        this.addInfoWindow(marker, content);
      })
    })



    console.log('addMarkersOnTheCustomersCurrentLocation called');
  }


  ///MAPS \
  setlocation(coords) {
    console.log(coords);

    this.infoWindow.setPosition(coords);
  }
  getGeolocation() {
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
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  mapOptions() {

    let mapOptions = google.maps.MapOptions = {
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
  initMap() {

    this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions());
    //this.mapElement = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions());
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

  obj = {
    lat: -26.1562825,
    lng: 27.7639596
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
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    const marker = new google.maps.Marker({
      position: props.coords,
      map: this.mapElement,
      icon: icon
    })

    if (props.iconImage) {

      marker.setIcon(props.iconImage)
    }

    if (props.content) {

      let infoWindow = new google.maps.InfoWindow({
        content: `<h5 style="margin:0;padding:0;">${props.name} </h5>` + props.content
      });
      marker.addListener('click', () => {
        infoWindow.open(this.mapElement, marker);
      })
    }
  }
  handleLoacationError(content, position) {
    this.infoWindow.setOptions(position);
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.mapElement)
  }

}
