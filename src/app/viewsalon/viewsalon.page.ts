import { Component, OnInit, NgZone, Renderer2 } from '@angular/core';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import { ModalController, ToastController, } from '@ionic/angular';
import * as firebase from 'firebase';
import { ReviewsPage } from '../reviews/reviews.page';
import { ModalPage } from '../modal/modal.page';
import { PicturePage } from '../picture/picture.page';
// import Swiper from 'swiper';

@Component({
  selector: 'app-viewsalon',
  templateUrl: './viewsalon.page.html',
  styleUrls: ['./viewsalon.page.scss'],
})
export class ViewsalonPage implements OnInit {
  styleCategory = 'female';
  viewReviews =  false;
  db = firebase.firestore();
  sliderConfig = {
    spaceBetween: 5,
    slidesPerView: 1.2,

  }
isRated = false
  likes;
  total = 0;
  rate = 0;
  analyticos = [];
  dummy = []
  found: boolean;
  userRating = []
  rating = []
  more = false;
  hair = [];
  viewhair = true;
  placeholder = this.backend.salonsDisply;
  aveg: number;
  heart: string = "unlike"
  color = "#DCDCDC";
  position: number;
  cardIndex = false
  starRating = document.getElementsByClassName('ionic4-star-rating')
  constructor(public control: ControlsService, public backend: BackendService, public modalController: ModalController, private ngZone: NgZone,public toastController: ToastController, public renderer: Renderer2) {
    this.backend.getHairSalon();

    //this.gethairstyles(this.gend);
    this.selecthairstyle('female');
    console.log("selectedsalon data", this.salond)
    console.log(this.likes)

    this.db.collection('Salons').where("salonName", "==", this.backend.salonname).onSnapshot(doc => {
      doc.forEach(res => {
        this.db.collection('Salons').doc(res.id).collection('ratings').onSnapshot(snap => {
          snap.forEach(doc => {
            this.rating.push(doc.data())
            this.userRating.push(doc.data().rating)
            console.log('users', doc.data().rating);
            this.total += doc.data().rating;
            console.log(this.total);
            this.dummy.push(doc.data().rating)
this.isRated = true

          })
          this.aveg = this.total / this.dummy.length;
          console.log('averge', this.aveg);
        })
      })
    })

    console.log('toatl for ratings', this.total)
  }
  salond = this.backend.selectedsalon;


  ngOnInit() {
    setTimeout(()=>{
      console.log(this.starRating);
      
      let starButtons =  this.starRating[0].children

      for (let i = 0; i < starButtons.length; i++) {
        console.log(this.starRating[0].children[i]);
        this.renderer.setStyle(this.starRating[0].children[i], 'outline', 'none');

      }
      
    }, 500)
    this.checkLikes()
  }
  

  checkLikes() {
    this.ngZone.run(() => {
      this.db.collection('Salons').where("salonName", "==", this.backend.salonname).onSnapshot(doc => {
        doc.forEach(res => {
          this.db.collection('Salons').doc(res.id).collection('likes').doc(firebase.auth().currentUser.uid).onSnapshot(res => {
            if (res.exists) {
              this.cardIndex = true ;
              console.log('it exists')
            } else {
              console.log('it doesnt exist');
            }
          })
        })
      })
    })
  }
  event() {
    this.cardIndex = !this.cardIndex;
    if (this.cardIndex == true) {
      this.presentToast();
      let liked = 'liked'
      console.log('liked');
      this.db.collection('Salons').where("salonName", "==", this.backend.salonname).get().then(res => {
        res.forEach(doc => {
          this.db.collection('Salons').doc(doc.id).collection('likes').doc(firebase.auth().currentUser.uid).set({
            like: liked,
            timeStamp: Date()
          })
        })
      })
    }
    else {
      this.presentToasta();
      this.db.collection('Salons').where("salonName", "==", this.backend.salonname).get().then(res => {
        res.forEach(doc => {
          this.db.collection('Salons').doc(doc.id).collection('likes').doc(firebase.auth().currentUser.uid).delete()
        })
      })
    }
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


  gethairstyles(x) {
    this.hair = [];
    console.log(this.backend.salonname)
    let limit;
    if(x =='male')
{
  limit =10;
}
else
{
  limit = 30;
}

console.log('limit = ',limit)

   let user = this.db.collection('Salons').doc(this.backend.salonuid).collection('Styles')


   let query = user.where("genderOptions", "==", x).limit(limit).get().then(val => {
     val.forEach(doc => {

       this.hair.push(doc.data());
       console.log('jkl', this.hair)
     })
   })
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Salon liked.',
      duration: 2000
    });
    toast.present();
  }
  async presentToasta() {
    const toast = await this.toastController.create({
      message: 'Salon unliked.',
      duration: 2000
    });
    toast.present();
  }

  choosehair(x) {
    console.log(x);
    this.backend.sethairstyledata(x.hairstyleName, x.duration, x.hairstylePrice, x.hairStyleImage, x.genderOptions);
    this.control.router.navigate(['bookwithsalon']);
  }

  viewHair() {
    this.more = !this.more
  }
  reviewed(){
    this.viewReviews= !this.viewReviews
  }



  async dislikeConfirm() {
    const alert = await this.control.alertCrtl.create({
      header: 'Confirm!',
      message: 'You have already liked ' + this.backend.salonname + '.',
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


  async press(x)
  {
    this.backend.sethairstyledata(x.hairstyleName, x.duration, x.hairstylePrice, x.hairStyleImage, x.genderOptions);
    console.log("PRESSED")


    let modal = await this.modalController.create(
      {
        component: PicturePage,
        cssClass: "wideModal"
      }
    );
    modal.present();
  }



  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: "wideModal"
    });
    return await modal.present();
  }
}




