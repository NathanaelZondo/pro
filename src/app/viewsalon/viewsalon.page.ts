import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import { ModalController, } from '@ionic/angular';
import * as firebase from 'firebase';

// import Swiper from 'swiper';

@Component({
  selector: 'app-viewsalon',
  templateUrl: './viewsalon.page.html',
  styleUrls: ['./viewsalon.page.scss'],
})
export class ViewsalonPage implements OnInit {
  styleCategory = 'female';
  db = firebase.firestore();
  sliderConfig = {
    spaceBetween: 5,
    slidesPerView: 1.2,
    
  }
  
likes;
total = 0;
rate = 0;
analyticos =[];
dummy = []
found:boolean;
userRating = []
  more = false;
  hair = [];
  viewhair = true;
  placeholder = this.backend.salonsDisply;
  aveg: number;
  heart : string ="unlike"
  color ="#DCDCDC";
  position:number;
    constructor(public control:ControlsService,public backend:BackendService,public modalController: ModalController) {
    this.backend.getHairSalon();

    //this.gethairstyles(this.gend);

    console.log("selectedsalon data", this.salond)


firebase.firestore().collection('Analytics').doc(this.salond[0].userUID).onSnapshot(val=>{
 let users = val.data().users;
 this.analyticos.push(val.data())

  console.log(" likes  = ",val.data());

  for( var o =0 ; o <users.length;o++)
  {

    console.log(" loop = ",val.data().users[o].voteruid ==firebase.auth().currentUser.uid);
if(val.data().users[o].voteruid==firebase.auth().currentUser.uid)
{
 console.log("found") 
 this.found =true;
 this.color ="rgb(240, 10, 10)";
 this.position = o;
 console.log(this.position)
}
else
{
  // this.found=false;
  // this.color = "#DCDCDC"
  console.log("Not found") 
}
  }
})

  
 
  




    console.log(this.likes)

    this.db.collection('Salons').where("salonName", "==", this.backend.salonname).onSnapshot(doc => {
      doc.forEach(res => {
        this.db.collection('Salons').doc(res.id).collection('ratings').onSnapshot(snap => {
          snap.forEach(doc => {
            this.userRating.push(doc.data().rating)
            console.log('users', doc.data().rating);
            this.total += doc.data().rating;
            console.log(this.total);
            this.dummy.push(doc.data().rating)

          })
          this.aveg = this.total / this.dummy.length;
          console.log('averge', this.aveg);
        })
      })
    })


    // this.db.collection('Salons').doc(this.backend.salonname).collection('ratings').onSnapshot(snap =>{
    // snap.forEach( doc =>{
    //   this.userRating.push(doc.data().rating)
    //   console.log('users', doc.data().rating);

    // this.total += doc.data().rating;
    // console.log(this.total);
    // this.dummy.push(doc.data().rating)


    // })
    // this.aveg = this.total / this.dummy.length;
    // console.log('averge', this.aveg);

    // })
    console.log('toatl for ratings', this.total)
  }
  salond = this.backend.selectedsalon;
  ngOnInit() {
  }
  gender;
  selecthairstyle(x) {
    console.log('Clicked', x);
    
    this.styleCategory = x;
    this.gender = x;
    this.gethairstyles(this.gender);

    //this.control.router.navigate(['viewhairstyle']);
    //this.control.router.navigate(['viewhairstyle']);

  }

  onViewDidEnter() {
    this.gethairstyles("female");
  }

  gethairstyles(x) {

    console.log(this.backend.salonname)
    this.hair = [];
    let user = this.db.collection('Salons').doc(this.salond[0].userUID).collection('Styles')


    let query = user.where("genderOptions", "==", x).get().then(val => {
      val.forEach(doc => {

        this.hair.push(doc.data());
        console.log('jkl', this.hair)
      })
    })

    
  }

  choosehair(x) {
    console.log(x);
    this.backend.sethairstyledata(x.hairstyleName, x.duration, x.hairstylePrice, x.hairStyleImage,x.genderOptions);
    this.control.router.navigate(['bookwithsalon']);
  }

  viewHair() {
    this.more = !this.more
  }



  like(x)
  {

console.log(x)
if(this.found ==true)
{
this.dislikeConfirm();
}
else
{
    let click = 1;
    let v1;
    let docid;

    x.userUID;
    firebase.firestore().collection('Analytics').doc(x.userUID).get().then(val=>{

      console.log("numbers = ",val.data())
      v1 =val.data().numberofviews+click;
      firebase.firestore().collection('Analytics').doc(x.userUID).set({"numberofviews":v1},{merge: true})
let smoray =val.data().users;
console.log("smoray =",val.data().users)
smoray.push({voteruid:firebase.auth().currentUser.uid});
smoray.push({voteruid:"someting"});
    //smoray.push({useruid:firebase.auth().currentUser.uid});
      firebase.firestore().collection('Analytics').doc(x.userUID).set({numberofviews:val.data().numberofviews,numberoflikes:val.data().numberoflikes+1,usercancel:val.data().usercancel,saloncancel:val.data().saloncancel,allbookings:val.data().allbookings,users:smoray});
    });

  }
}



async dislikeConfirm() {
  const alert = await this.control.alertCrtl.create({
    header: 'Confirm!',
    message: 'You have already liked '+ this.backend.salonname+'.',
    buttons: [
      {
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');



         }
          }
        ]
      });
  
      await alert.present();
    }

}


  

