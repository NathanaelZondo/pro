import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { BackendService } from '../backend.service';
import { ControlsService } from '../controls.service';
import * as firebase from 'firebase';
import { ModalPage } from '../modal/modal.page';
import { ModalController, AlertController } from '@ionic/angular';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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
  constructor(private alertController: AlertController,public backend:BackendService,public control:ControlsService,public modalController:ModalController,public controls:ControlsService, private elemntref:ElementRef, private renderer: Renderer2) {
   this.newdata =[];
   let v =0;    
   this.control.Loading2();
   this.backend.getuserbookings().orderBy("userdate","desc").limit(10).get().then(val=>{
     val.forEach(doc=>{
       console.log("top 10",doc.data())
       this.userbooking.push(doc.data())
     })
   })


   let currentdate = (new Date().getFullYear().toString())+'-'+(new Date().getMonth())+'-'+(new Date().getDate());
    if((new Date().getMonth()+1)<10)
    {

      currentdate = (new Date().getFullYear().toString())+'-0'+(new Date().getMonth()+1)+'-'+(new Date().getDate());
    if((new Date().getDate())<10)
    {
      currentdate = (new Date().getFullYear().toString())+'-0'+(new Date().getMonth()+1)+'-0'+(new Date().getDate());
    }
    }

    firebase.firestore().collection('Bookings').doc(firebase.auth().currentUser.uid).collection('userbookings').where("userdate","==",currentdate).get().then(val =>{
      val.forEach(doc =>{
      this.userbooking.push(doc.data())
     // console.log(doc.data());
     //console.log(doc.data().surname,doc.data().hairdresser,doc.data().userdate,doc.data().salonname)
     //this.values(doc.data().salonname,doc.data().hairdresser,doc.data().userdate,currentdate,doc.data().surname) 
    

     console.log("userbooking length = ",this.userbooking.length)

   console.log("surname is",v ) 
      this.values(doc.data().salonname,doc.data().hairdresser,doc.data().userdate,currentdate,doc.data().surname)
 
 v = v+1;     
  
 

      });
    });

   

  
   }

  ngOnInit() {
    let color = ['whitesmoke','white']
    let cards = this.elemntref.nativeElement.children[1].children[0].children
    setTimeout(()=> {
      console.log('native els: ', cards);
      for (let i = 0; i < cards.length; i++) {
        const change = i %2;
        const random = Math.floor(Math.random() * color.length);

        if (change) {
          this.renderer.setStyle(cards[i].children[0], 'background', color[0])
        console.log('card', i , 'styling');
        } else {
          this.renderer.setStyle(cards[i].children[0], 'background', color[1])
        console.log('card', i , 'styling');
        }
        
      }
    }, 1000)
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
firebase.firestore().collection('SalonNode').doc(x.salonname).collection('staff').doc(x.hairdresser).collection(x.userdate).doc(x.id).update({
  status: 'cancelled'
}).then(res=>{
  console.log(res)
});

  

  let click = 1;
  let v1;
  let docid;
  
  firebase.firestore().collection('salonAnalytics').doc(x.salonuid).collection('numbers').get().then(val=>{
    console.log("These are the numbers",val)
    val.forEach(qu=> 
  
      {
      docid =qu.id;
      console.log(docid)
      console.log(qu.data().usercancellations)
      v1 =qu.data().usercancellations;
  
      firebase.firestore().collection('salonAnalytics').doc(x.salonuid).collection('numbers').doc(qu.id).update({"usercancellations":v1+click}).then(zet=>{
        console.log(zet)
      })
      })
    })




    firebase.firestore().collection('userAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').get().then(val=>{
      console.log("These are the numbers",val)
      val.forEach(qu=> 
    
        {
        docid =qu.id;
        console.log(docid)
        console.log(qu.data().usercancellations)
        v1 =qu.data().usercancellations;
    
        firebase.firestore().collection('userAnalytics').doc(firebase.auth().currentUser.uid).collection('numbers').doc(qu.id).update({"usercancellations":v1+click}).then(zet=>{
          console.log(zet)
        })
        })
      })


  }


  values(a,b,c,d,e)
  {
console.log("line 127 ",a,b,c,d);
//this.values(doc.data().salonname,doc.data().hairdresser,doc.data().userdate,currentdate)


firebase.firestore().collection('SalonNode').doc(a).collection('staff').doc(b).collection(c).where("surname","==",e).where("userdate","==",d).get().then(val=>{
  val.forEach(val2=>{
    console.log(val2.data())
var obj ={id:val2.id}

console.log(console.log(obj))









this.newdata.push( { ...obj ,... val2.data()})

console.log("New data = ",this.newdata)



});
});

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
  
  



