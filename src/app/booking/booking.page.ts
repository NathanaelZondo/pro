import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import * as firebase from 'firebase';
import { ModalPage } from '../modal/modal.page';
import { ModalController, AlertController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})

export class BookingPage implements OnInit {
  userbooking = [];
  low = false;
  surname;
  userdate;
  hairdresser;
  salonname;
  currentdate;
  useruid;
  newdata = [];
  ob = {};
  buttonactive;
  isvalidated = true;
  
  color2 ='#'+(Math.random()*0xFFFFFF<<0).toString(16);
  random1 =Math.random() * (255 - 65) + 65;
  random2 =Math.random() * (68 - 24) + 24;
  random3 =Math.random() * (30 - 5) + 5;


  random11 =Math.random() * (50) ;
  random22 =Math.random() * (50-10) + 10;
  random33 =Math.random() * (50 - 5) + 5;

color ="rgba("+this.random1+","+this.random2+","+this.random3+","+ "0.714)";
  color3 ="rgba("+this.random11+","+this.random22+","+this.random33+","+ "1)";
  constructor(private alertController: AlertController, public backend: BackendService, public control: ControlsService, public modalController: ModalController, public controls: ControlsService, public elementRef: ElementRef, public renderer: Renderer2,private oneSignal: OneSignal) {
    
    console.log("Colors =",this.color);
    this.newdata = [];
    let v = 0;
    this.control.Loading2();


    let currentdate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth()) + '-' + (new Date().getDate());
    if ((new Date().getMonth() + 1) < 10) {

      currentdate = (new Date().getFullYear().toString()) + '-0' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
      if ((new Date().getDate()) < 10) {
        currentdate = (new Date().getFullYear().toString()) + '-0' + (new Date().getMonth() + 1) + '-0' + (new Date().getDate());

      }

    }

  else if ((new Date().getMonth() + 1) >= 10)
  {
    currentdate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
  
    if ((new Date().getDate()) < 10) {
      currentdate = (new Date().getFullYear().toString()) + '-' + (new Date().getMonth() + 1) + '-0' + (new Date().getDate());
    }
  }
  
     






    this.currentdate = currentdate;
    console.log("Currentdate",this.currentdate)
  }


  ngOnInit() {
setTimeout(()=>{
  let cards = this.elementRef.nativeElement.children[1].children[0].children
  console.log(cards);
  let colors = ["none", "rgb(66, 66, 66,0.5)"]
  for (let i = 1; i < cards.length; i++) {
    console.log(cards[i].children[0]);
    let random = i % 2;
    if (random) {
      this.renderer.setStyle(cards[i].children[0], 'background', `${colors[0]}`)
    } else {
      this.renderer.setStyle(cards[i].children[0], 'background', `${colors[1]}`)
    }
    
  }
}, 1000)
    
    firebase.firestore().collection('Bookings').where("useruid", "==", firebase.auth().currentUser.uid).orderBy("userdate", "desc").limit(15).get().then(val => {
      val.forEach(doc => {
        console.log(doc.id)
        this.ob = { id: doc.id };
        this.userbooking.push({ ...this.ob, ...doc.data() })

        console.log(this.userbooking)


      });
    });
  }
  alldata;
  forthealert(x) {
    this.alldata = x;
    this.haidressername = x.hairdresser;
    this.hairsalon = x.salonname;
    if( this.alldata.TokenID){
      var notificationObj = {
        contents: { en: "Hey " + this.alldata.salonname + " " +this.alldata.name + " Has cancelled a booking with you"},
        include_player_ids: [this.backend.selectedsalon[0].TokenID],
      }
      this.oneSignal.postNotification(notificationObj).then(res => {
       // console.log('After push notifcation sent: ' +res);
      })
    }
    this.cancelbookingConfirm();

    console.log(this.alldata)

  }

  haidressername;
  hairsalon;

  cancel(v) {
    let x = v;
    console.log("USER Clicked", x);

    this.haidressername = x.hairdresser;
    this.hairsalon = x.salonname;
    x.status = "cancelled";
    firebase.firestore().collection('Bookings').doc(x.id).update({
      status: 'cancelled'
    }).then(res => {
      console.log(res)
    });



    let click = 1;
    let v1;
    let docid;

    // firebase.firestore().collection('salonAnalytics').doc(x.salonuid).collection('numbers').get().then(val=>{
    //   console.log("These are the numbers",val)
    //   val.forEach(qu=> 

    //     {
    //     docid =qu.id;
    //     console.log(docid)
    //     console.log(qu.data().usercancellations)
    //     v1 =qu.data().usercancellations;

    //     firebase.firestore().collection('salonAnalytics').doc(x.salonuid).collection('numbers').doc(qu.id).update({"usercancellations":v1+click}).then(zet=>{
    //       console.log(zet)
    //     })
    //     })
    //   })




    // firebase.firestore().collection('userAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').get().then(val=>{
    //   console.log("These are the numbers",val)
    //   val.forEach(qu=> 

    //     {
    //     docid =qu.id;
    //     console.log(docid)
    //     console.log(qu.data().usercancellations)
    //     v1 =qu.data().usercancellations;

    //     firebase.firestore().collection('userAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').doc(qu.id).update({"usercancellations":v1+click}).then(zet=>{
    //       console.log(zet)
    //     })
    //     })
    //   })


  }







  viewdetails(x) {
    console.log(x)
    this.backend.setbookingdetails(x)
    this.presentModal();
  }


  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage
    });
    return await modal.present();
  }

  back() {
    this.control.navCtrl.setDirection('root');
    this.control.navCtrl.navigateRoot('/navigation');
  }


  async cancelbookingConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you want to cancel booking with ' + this.haidressername + " at " + this.hairsalon + " hairsalon?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.cancel(this.alldata);
            
            this.control.cancelbookingToast();
            console.log('Confirm Okay');

           
             
          
            firebase.firestore().collection('Analytics').doc(this.alldata.salonuid).get().then(val=>{
        
              console.log("numbers = ",val.data())
           
              firebase.firestore().collection('Analytics').doc(this.alldata.salonuid).set({numberofviews:val.data().numberofviews,numberoflikes:val.data().numberoflikes,usercancel:val.data().usercancel+1,saloncancel:val.data().saloncancel,allbookings:val.data().allbookings,users:val.data().users});
            });
        
          }
        }
      ]
    });

    await alert.present();
  }
}





