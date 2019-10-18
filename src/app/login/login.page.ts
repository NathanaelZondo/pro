import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../../app/auth.service';
import { Router } from '@angular/router';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public loading: HTMLIonLoadingElement;
  loaderAnimate = true;
  hide='';
  constructor(
    public nav:NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    public ReactiveFormsModule: ReactiveFormsModule,
    public FormsModule: FormsModule,
    public control:ControlsService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  ngOnInit() {
   
  }

  async loginUser(loginForm: FormGroup): Promise<void> {
    //this.loaderAnimate = true;
    if (!loginForm.valid) {
      console.log('Form is not valid yet, current value:', loginForm.value);
    } else {
      // this.loading = await this.loadingCtrl.create();
      // await this.loading.present();

      const email = loginForm.value.email;
      const password = loginForm.value.password;

    
    

      


      this.authService.loginUser(email, password).then(
        () => {
            this.control.router.navigateByUrl('/navigation',{ replaceUrl: true });
        }).catch(async err=>{
          console.log()
         






      
            const alert = await this.alertCtrl.create({
              subHeader:"Login error",
              message: err.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();



        })
    }
  }

  login()
  {

this.control.router.navigate(['signup']);
  }

  reset(){
this.presentAlertPrompt();
  }
  async presentAlertPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Reset Password',
      message: 'Enter your email so we can send the password reset link.',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Email'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Send Email',
          handler: data => {
            this.authService.resetPassword(data.name1).then(
              async () => {
                const alert = await this.alertCtrl.create({
                  message: 'Check your email for a password reset link',
                  buttons: [
                    {
                      text: 'Ok',
                      role: 'cancel',
                      handler: () => {
                 
                          this.presentLoading()
                      }
                    }
                  ]
                });
                await alert.present();
              },
              async error => {
                const errorAlert = await this.alertCtrl.create({
                  message: error.message,
                  buttons: [{ text: 'Ok', role: 'cancel' }]
                });
                await errorAlert.present();
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait..',
      duration: 1000
    });
    await loading.present();

}
inputEvent(data){

  if(data=='open'){
     this.hide='value'
  } else if(data=='close') {
    this.hide='';
  }
  
}

}