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

  ngOnInit() {}

  async loginUser(loginForm: FormGroup): Promise<void> {
    if (!loginForm.valid) {
      console.log('Form is not valid yet, current value:', loginForm.value);
    } else {
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();

      const email = loginForm.value.email;
      const password = loginForm.value.password;

      this.authService.loginUser(email, password).then(
        () => {
          this.loading.dismiss().then(() => {
          //  this.nav.navigateRoot('/navigation');
          this.control.LoginToast();
            this.control.router.navigateByUrl('/navigation',{ replaceUrl: true });
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            await alert.present();
          });
        }
      );
    }
  }

  login()
  {

this.control.router.navigate(['signup']);
  }
}