import { Component, OnInit, NgZone, Renderer2 } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { ViewChild, ElementRef } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import * as firebase from 'firebase';
import { Storage } from "@ionic/storage";
import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';

// import undefined = require('firebase/empty-import');
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { BackendService } from '../backend.service';
import { Profile } from '../profile';
import { ControlsService } from '../controls.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonSlides } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';


declare var google;
@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  searchbyName = false

  sliderConfig = {
    initialSlide: 0,
    spaceBetween: 5,
    centeredSlides: true,
    slidesPerView: 1.2,
    watchOverflow: true
  }
  loaderAnimate = true;
  // toggles the div, goes up if true, goes down if false
  display = false;
  swipeUp() {
    this.display = !this.display;
  }
  indexSlides: number;
  options: GeolocationOptions;
  currentPos: Geoposition;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  @ViewChild('sliderRef', { static: true }) slides: IonSlides;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
  db = firebase.firestore();
  users = [];
  map: any;
  latitude: number;
  longitude: number;
  SOUTH_AFRICAN_BOUNDS = {
    north: -21.914461,
    south: -35.800139,
    west: 15.905430,
    east: 34.899504
  }
  mapCenter: any = {
    lat: 0,
    lng: 0
  };
  DirectionsCenter = {
    lat: 0,
    lng: 0
  }
  fullAdress
  ports = []
  geocoder = new google.maps.Geocoder;
  fiter = ''
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

  isChecked = false
  salonname;
  salons = []
  salond = this.backend.salonsDisply;
  private versionType: any;
  cardIndex = true;
  duration
  distance
  searchby = {
    location: false,
    salon: false
  }
  searchbyLocation = false;
  unlike = false
  hide = '';
  autocom
  salonContainer = document.getElementsByClassName('salonlist')
  autoCompSearch = document.getElementsByClassName('searchbar-input');
  constructor(private device: Device, private androidPermissions: AndroidPermissions,
    public store: Storage, public ngZone: NgZone, private geolocation: Geolocation,
    public alertController: AlertController, public elementref: ElementRef, public router: Router,
    private nativeGeocoder: NativeGeocoder, public loadingController: LoadingController,
    public backend: BackendService, public control: ControlsService, private platform: Platform, private keyboard: Keyboard, public rendere: Renderer2) {
    console.log('element Slideers: ', this.mapCenter);
    console.log('salond: ', this.salond);
    this.versionType = device.version;

    setTimeout(() => {
      this.ngZone.run(() => {
        this.AutoComplete();
      })
    }, 500);

  }
  AutoComplete() {
    this.ngZone.run(() => {
      this.autocom = new google.maps.places.Autocomplete(this.autoCompSearch[0], { types: ['geocode'] });
      this.autocom.addListener('place_changed', () => {
        let place = this.autocom.getPlace();
        console.log(place);
        let latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
       
        
      let geoData = {
        lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
      }
      // get the address from the current position's coords
      this.geocoder.geocode({ 'location': geoData }, (results, status) => {
        console.log('Geocode responded with', results, 'and status of', status)
        if (status) {
          if (results[0]) {
            // get the city from the address components
            this.fiter = results[1].address_components[4].short_name;
         
      
           this.getFilteredSalonMarkers();
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      })
      this.map.panTo(latLng);

      });
    })
  }
  inputEvent(data) {
    this.ngZone.run(() => {
      if (data == 'open') {
        this.rendere.setStyle(this.salonContainer[0], 'transform', 'translateY(30vh)')
      } else if (data == 'close') {
        this.rendere.setStyle(this.salonContainer[0], 'transform', 'translateY(0)')
      }
    })
  }
  showDistance() {
    this.cardIndex = !this.cardIndex;
  }
  option(cmd) {
    if (cmd == 'location') {
      this.searchby.location = !this.searchby.location
      this.searchbyLocation = false;
    } else {
      this.searchby.salon = !this.searchby.salon
      this.searchbyLocation = false;
    }
  }

  searchByLocation() {
    this.searchbyLocation = true;
  }
  checkhide() {
    console.log('keyboards', this.keyboard.isVisible);

    if (this.keyboard.isVisible) {
      this.isChecked = true;

    }
    else {
      this.isChecked = false;
      // this.keyboard.hide();
    }
  }
  async  moveMapEvent(): Promise<void> {
    this.ngZone.run(() => {
      this.slides.getActiveIndex().then(index => {

        // this.cardIndex = index;
        console.log(index);
        console.log('currentIndex:', this.cardIndex);
        let currentEvent = this.salons[index]
        console.log('something nyana', currentEvent.Address.lat);
        this.fullAdress = currentEvent.Address.fullAddress;
        this.DirectionsCenter = {
          lat: currentEvent.Address.lat,
          lng: currentEvent.Address.lng
        }


      })
      this.geolocation.getCurrentPosition().then((resp) => {

        let geoData = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        }
        this.ngZone.run(() => {
          let start = new google.maps.LatLng(geoData.lat, geoData.lng);
          let end = new google.maps.LatLng(this.DirectionsCenter.lat, this.DirectionsCenter.lng);
          const that = this;
          this.directionsService.route({
            origin: start,
            destination: end,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC
          }, (response, status) => {
            if (status === 'OK') {
              let distance = response.routes[0].legs[0].distance.text
              let duration = response.routes[0].legs[0].duration.text
              this.duration = duration
              this.distance = distance
              console.log('Distance: ', distance, ' Duration: ', duration);

              that.directionsDisplay.setDirections(response);
              that.directionsDisplay.setMap(this.map);
            } else {
              console.log('    request failed due to ' + status);
            }
          });
        })

        //
      })
    })


    return Promise.resolve();
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
    console.log("Address = ", x.Address.streetName)
    this.backend.selectedsalon.splice(0, 1);
    console.log(x.userUID)
    this.cover = x.salonImage;
    this.desc = x.SalonDesc;
    this.location = x.streetName;
    this.backend.salonname = x.salonName;
    this.backend.selectedsalon.push(x);
    this.backend.selectedsalon.splice(1, 1);
    this.backend.setsalondata(x.salonName, x.Address.streetName);

    let click = 1;
    let v1;
    let docid;

    this.backend.salonuid = x.userUID;
    firebase.firestore().collection('Analytics').doc(x.userUID).get().then(val => {

      console.log("numbers = ", val.data())
      v1 = val.data().numberofviews + click;
      firebase.firestore().collection('Analytics').doc(x.userUID).set({ "numberofviews": v1 }, { merge: true })
    });
    this.control.router.navigate(['viewsalon']);
  }

  ngOnInit() {

    this.ngZone.run(() => {
      let versionNumber = '5.1.1'
      if (this.versionType === versionNumber) {
        this.getUserPosition()
        console.log('its got it')
      } else {
        this.promptLocation();
        console.log('masbone')
      }
    })

  }
  getHairSalon() {
    this.ngZone.run(()=>{
 
      this.ports = [];
      this.db.collection('Salons').onSnapshot(snap => {
        if (snap.empty !== true) {
          this.salons = []
          snap.forEach(doc => {
            this.db.collection('Salons').doc(doc.id).collection('staff').onSnapshot(res => {
              if (!res.empty) {
                  this.salons.push(doc.data())
                 }
             
            })
            this.db.collection('Salons').doc(firebase.auth().currentUser.uid).collection('Styles').onSnapshot(qu => {
              this.hairstyledata = []
              qu.forEach(doc => {
                this.hairstyledata.push(doc.data());
                this.hairstyledata.splice(1, 1);
                console.log(this.hairstyledata.length)
              })

            })
            this.ports.push({ names: doc.data().salonName })
          })
        } else {
          console.log('No data')
        }
      })
    })

  }
  portChange(event: { component: IonicSelectableComponent, value: any }) {
    this.ngZone.run(() => {
      this.db.collection('Salons').where("salonName", "==", event.value.names).get().then(response => {

        response.forEach(doc => {
          console.log('size for tshirt', doc.data());
          this.selectsalon(doc.data())
        })

      })
    })
  }
  getUserPosition() {
    this.ngZone.run(() => {
      this.options = {
        enableHighAccuracy: true,
      };
      this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
        let geoData = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
        this.geocoder.geocode({ 'location': geoData }, (results, status) => {
          console.log('Geocode responded with', results, 'and status of', status)
          if (status) {
            if (results[0]) {
              // get the city from the address components
              this.fiter = results[1].address_components[4].short_name;
              console.log('filterd by', results);
              console.log('match', this.fiter);
              this.getFilteredSalonMarkers();
            } else {
              console.log('No results found');
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        }, err => {
          console.log('Geocoder failed with', err)
        });
        this.currentPos = pos;
        console.log(pos);
        this.addMap(pos.coords.latitude, pos.coords.longitude);
        console.log('Current Location', pos);
        this.addMarker();
      }, (err: PositionError) => {
        console.log("error : " + err.message);
      });

    })

  }

  getSalonmarkrs() {
    this.ngZone.run(() => {
    
      this.db.collection('Salons').get().then(snapshot => {
        snapshot.forEach(doc => {
          this.db.collection('Salons').doc(doc.id).collection('staff').onSnapshot(res => {
            if (!res.empty) {
              let content = `<h5> ${doc.data().salonName} </h5> <p>${doc.data().SalonContactNo}</p> <p>${doc.data().Address.fullAddress}</p>`; 
                        //  this.addMarkersOnTheCustomersCurrentLocation(doc.data().lat, doc.data().lng, content);
          const icon = {
            url: '../../assets/icon/Hair_Dresser_3.svg', // image url
            scaledSize: new google.maps.Size(55, 55), // scaled size
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),

          };

          let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(doc.data().Address.lat, doc.data().Address.lng),
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
          google.maps.event.addListener(marker, 'click', () => {
            this.selectsalon(doc.data());
          });

          console.log('cords', doc.data().lat, doc.data().lng);

            }
          })
          // content = `<h1>${doc.data().salonName}</h1> <br> <p>`
        })
        this.loaderAnimate = false;
      });
    })

  }
  function() {
    console.log('Dont pull');

  }
  addMap(lat: number, long: number) {
    let latLng = new google.maps.LatLng(lat, long);
    var grayStyles = [
      {
        featureType: "all",
        styles: [
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

  }

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
      position: this.map.getCenter(),
      icon: '../../assets/icon/usermark.svg'
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

  async requestPrompt() {
this.loaderAnimate = true
    console.log('Requested Prompt')
    await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(async res => {
      console.log('Accepted', res);
      if (res.hasPermission) {
        await this.store.set('acceptedPermission', 'yes').then(res => {
          this.getlocation();
        })
      }
      //  } else {
      //   await this.store.set('acceptedPermission', 'no')
      //   this.mapCenter.lat = -29.465306;
      //   this.mapCenter.lng = 24.741967;
      //   // this.initMap()
      //   // load the map with the zoom of 2
      //   this.loadMap(2);
      //   this.getSalonmarkrs();

      //   this.loaderAnimate = false;
      // }
    })
    this.loaderAnimate = false
  }
  async promptLocation() {

    this.store.get('acceptedPermission').then(async res => {
      // checks the acceptedPermission value if its null
      if (res == null) {
        // checks the permission
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(async res => {
          console.log('location responded with', res);
          // if we dont have location permission
          if (res.hasPermission == false) {
            // request it here
            await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(res => {
              // check if the access is  true
              if (res.hasPermission) {
                // if access is true store update acceptedPermission to yes
                this.store.set('acceptedPermission', 'yes').then(res => {
                  console.log('Storage loc var updated');

                })
                this.getlocation();
              } else {
                // if the user denies the location then set the value to no
                this.store.set('acceptedPermission', 'no')
                this.mapCenter.lat = -29.465306;
                this.mapCenter.lng = 24.741967;
                // this.initMap()
                // load the map with the zoom of 2
                this.loadMap(2);
                this.getSalonmarkrs();
                this.getHairSalon();
              }
            }).catch(err => {
              console.log('Rejected', err);
              // if the user denies the location then set the value to no
              this.store.set('acceptedPermission', 'no')
              this.mapCenter.lat = -29.465306;
              this.mapCenter.lng = 24.741967;
              // this.initMap()
              // load the map with the zoom of 2
              this.loadMap(2);
              this.getSalonmarkrs();
              this.getHairSalon();
            })
          }
        }).catch(err => {
          console.log('RESPONSE', err);
        
          // if the user denies the location then set the value to no
          this.store.set('acceptedPermission', 'no')
          this.mapCenter.lat = -29.465306;
          this.mapCenter.lng = 24.741967;
          this.loadMap(2);
          this.getSalonmarkrs();
          this.getHairSalon();
        })
      } else if (res == 'yes') {
        this.getlocation()
      } else if (res == 'no') {
        this.ngZone.run(() => {
          this.mapCenter.lat = -29.465306;
          this.mapCenter.lng = 24.741967;
          this.loadMap(2);
          this.getSalonmarkrs();
          this.getHairSalon();
          this.loaderAnimate = false;
        })

      }
    })
  }
  async loadMap(zoomlevel: number) {
    console.log('Loaded map with soom of', zoomlevel);
    let location;
    var ref = this;
    let watch = this.geolocation.watchPosition();

    let mapOptions = {
      center: this.mapCenter,
      zoom: zoomlevel,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: [
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ],
      restriction: {
        latLngBounds: this.SOUTH_AFRICAN_BOUNDS,
        strictBounds: true
      }
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    google.maps.event.addDomListener(this.map, 'click', () => {
      this.rendere.setStyle(this.salonContainer[0], 'transform', 'translateY(0)')
    });
   
  }
  async getlocation() {
    // get the current position
    await this.geolocation.getCurrentPosition().then((resp) => {
      console.log('Location responded with', resp);

      this.mapCenter.lat = resp.coords.latitude;
      this.mapCenter.lng = resp.coords.longitude;

      let geoData = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      }
      // get the address from the current position's coords
      this.geocoder.geocode({ 'location': geoData }, (results, status) => {
        console.log('Geocode responded with', results, 'and status of', status)
        if (status) {
          if (results[0]) {
            // get the city from the address components
            this.fiter = results[1].address_components[4].short_name;
            console.log('filterd by', results);
            console.log('match', this.fiter);
            this.getFilteredSalonMarkers();
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      }, err => {
        console.log('Geocoder failed with', err)
      });

      // load the map with the zoom of 14
      this.loadMap(13);
      this.getSalonmarkrs();
      this.addMarker();



    }).catch((err) => {
      //  load default coords (center of SA) if the location was rejected
      this.mapCenter.lat = -29.465306;
      this.mapCenter.lng = 24.741967;

      this.loadMap(2);
      //  get all of the hair Salons
      this.getSalonmarkrs();
      this.getHairSalon()
    })
  }
  async getFilteredSalonMarkers() {
    await this.db.collection('Salons').where('Metro', '==', this.fiter).onSnapshot(async snapshot => {
      console.log('Salon filtered');
      this.users = [];
      this.ports = []
      this.salons = []
      snapshot.forEach(async doc => {

        this.db.collection('Salons').doc(doc.id).collection('staff').onSnapshot(res => {
 
          if (!res.empty) {
            let content = '<b>Salon Name : ' + doc.data().salonName + '<br>' + 'SALON CONTACT NO:' + doc.data().SalonContactNo + '<br>' + 'SALON ADDRESS: ' + doc.data().Address.fullAddress
            this.ports.push({ names: doc.data().salonName })
            this.salons.push(doc.data())
            // const icon = {
            //   url: '../../assets/icon/Hair_Dresser_3.svg', // image url
            //   scaledSize: new google.maps.Size(35, 35), // scaled size
            //   size: new google.maps.Size(71, 71),
            //   origin: new google.maps.Point(0, 0),
            //   anchor: new google.maps.Point(17, 34),
    
            // };
    
            // let marker = new google.maps.Marker({
            //   map: this.map,
            //   animation: google.maps.Animation.DROP,
            //   position: new google.maps.LatLng(doc.data().Address.lat, doc.data().Address.lng),
            //   icon: icon
            // });
            // this.addInfoWindow(marker, content);
            // marker.setMap(this.map);
            // let infoWindow = new google.maps.InfoWindow({
            //   content: content
            // });
    
            // google.maps.event.addListener(marker, 'click', () => {
            //   infoWindow.open(this.map, marker);
            // });
            // google.maps.event.addListener(marker, 'click', () => {
            //   this.selectsalon(doc.data());
            // });
            //  this.addMarker(doc.data());
            console.log('run through', this.salons);
             }
         
        })
      


      })
      this.loaderAnimate = false;

    })


  }

}
