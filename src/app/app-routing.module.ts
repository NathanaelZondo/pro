import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
//   { path: 'onboarding', loadChildren: './onboarding/onboarding.module#OnboardingPageModule' },
//   { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
//   { path: 'createprofile', loadChildren: './createprofile/createprofile.module#CreateprofilePageModule' },
//   { path: 'viewprofile', loadChildren: './viewprofile/viewprofile.module#ViewprofilePageModule' },
//   { path: 'registration', loadChildren: './registration/registration.module#RegistrationPageModule' },
//   { path: 'viewsalon', loadChildren: './viewsalon/viewsalon.module#ViewsalonPageModule' },
//   { path: 'viewhairstyle', loadChildren: './viewhairstyle/viewhairstyle.module#ViewhairstylePageModule' },
//   { path: 'bookwithsalon', loadChildren: './bookwithsalon/bookwithsalon.module#BookwithsalonPageModule' },
//   { path: 'booking', loadChildren: './booking/booking.module#BookingPageModule' },
//   { path: 'maps', loadChildren: './maps/maps.module#MapsPageModule' },

const routes: Routes = [
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'onboarding', loadChildren: './onboarding/onboarding.module#OnboardingPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule'},
  { path: 'createprofile', loadChildren: './createprofile/createprofile.module#CreateprofilePageModule' },
  { path: 'updateprofile', loadChildren: './updateprofile/updateprofile.module#UpdateprofilePageModule' },
  { path: 'viewprofile', loadChildren: './viewprofile/viewprofile.module#ViewprofilePageModule' },
  { path: 'viewsalon', loadChildren: './viewsalon/viewsalon.module#ViewsalonPageModule' },
  { path: 'viewhairstyle', loadChildren: './viewhairstyle/viewhairstyle.module#ViewhairstylePageModule' },
  { path: 'bookwithsalon', loadChildren: './bookwithsalon/bookwithsalon.module#BookwithsalonPageModule' },
  { path: 'booking', loadChildren: './booking/booking.module#BookingPageModule' },
  { path: 'updateprofile', loadChildren: './updateprofile/updateprofile.module#UpdateprofilePageModule' },
  { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'reset-password', loadChildren: './reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'maps', loadChildren: './maps/maps.module#MapsPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
