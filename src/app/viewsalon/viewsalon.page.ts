import { Component, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { BackendService } from '../backend.service';
import { ModalController } from '@ionic/angular';
import * as firebase from 'firebase'; 
@Component({
  selector: 'app-viewsalon',
  templateUrl: './viewsalon.page.html',
  styleUrls: ['./viewsalon.page.scss'],
})
export class ViewsalonPage implements OnInit {
  hairstyledata:Array<any>=[];
  constructor(public control:ControlsService,public backend:BackendService,public modalController: ModalController) {
  
    this.gethairstyles();
    this.hairstyledata =this.backend.hairstyledata;
    console.log("Hhairstyle data",this.hairstyledata)
   }

  ngOnInit() {
  }
gender =0;
  selecthairstyle(x)
  {
   

    

    this.gender = x;
    if(x == 'male')
    {
      this.gethairstyles();
    //this.control.router.navigate(['viewhairstyle']);
  }
else{
  this.gethairstyles();
  //this.control.router.navigate(['viewhairstyle']);
}
  }
db=firebase.firestore();

  gethairstyles()
  {
   console.log(this.backend.salonname)

this.db.collection('SalonNode').doc(this.backend.salonname).collection('Styles').get().then(val =>{
  val.forEach(doc=>{   
    console.log(doc.data())
  this.hairstyledata.push(doc.data());
  })
})

 
  }

  choosehair(x)
  {
    console.log(x);
    this.backend.sethairstyledata(x.hairstyleName,x.duration,x.hairstylePrice);
    this.control.router.navigate(['bookwithsalon']);
  }


}




