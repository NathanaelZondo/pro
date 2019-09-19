import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import * as firebase from 'firebase';
import { ModalPage } from '../modal/modal.page';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})

export class BookingPage implements OnInit {
  userbooking=[];
   low = false;
   surname;
   userdate;
   hairdresser;
   salonname;
   useruid;
  newdata =[];
  ob ={};
   buttonactive ;
   isvalidated =true;
  constructor(private alertController: AlertController,public backend:BackendService,public control:ControlsService,public modalController:ModalController,public controls:ControlsService) {
   this.newdata =[];
   let v =0;    
   this.control.Loading2();
  











   let currentdate = (new Date().getFullYear().toString())+'-'+(new Date().getMonth())+'-'+(new Date().getDate());
    if((new Date().getMonth()+1)<10)
    {

      currentdate = (new Date().getFullYear().toString())+'-0'+(new Date().getMonth()+1)+'-'+(new Date().getDate());
    if((new Date().getDate())<10)
    {
      currentdate = (new Date().getFullYear().toString())+'-0'+(new Date().getMonth()+1)+'-0'+(new Date().getDate());
    }
    }

    

   

  
   }

  ngOnInit() {
    firebase.firestore().collection('Bookings').where("useruid","==",this.backend.uid).get().then(val =>{
      val.forEach(doc =>
        
        {
          console.log(doc.id)
          this.ob ={id:doc.id};
      this.userbooking.push({...this.ob,...doc.data()})
  
  console.log( this.userbooking)
 

      });
    });
  }
  alldata;
forthealert(x)
{
this.alldata =x;
this.haidressername =x.hairdresser;
this.hairsalon =x.salonname;
this.cancelbookingConfirm();
console.log(this.alldata)

}

haidressername;
hairsalon;
  cancel(v)
  {
    let x = v;
console.log("USER Clicked",x);

this.haidressername =x.hairdresser;
this.hairsalon =x.salonname;
x.status ="cancelled";
firebase.firestore().collection('Bookings').doc(x.id).update({
  status: 'cancelled'
}).then(res=>{
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




  


viewdetails(x)
{
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

back()
{
  this.control.navCtrl.setDirection('root');
  this.control.navCtrl.navigateRoot('/navigation'); 
}


async cancelbookingConfirm() {
  const alert = await this.alertController.create({
    header: 'Confirm!',
    message: 'Do you want to cancel booking with '+this.haidressername+ " at "+this.hairsalon+" hairsalon?",
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
        }
      }
    ]
  });

  await alert.present();
}
}
  
  



