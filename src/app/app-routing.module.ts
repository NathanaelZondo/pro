import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'onboarding', loadChildren: './onboarding/onboarding.module#OnboardingPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'createprofile', loadChildren: './createprofile/createprofile.module#CreateprofilePageModule' },
  { path: 'viewprofile', loadChildren: './viewprofile/viewprofile.module#ViewprofilePageModule' },
  { path: 'registration', loadChildren: './registration/registration.module#RegistrationPageModule' },
  { path: 'viewsalon', loadChildren: './viewsalon/viewsalon.module#ViewsalonPageModule' },
  { path: 'viewhairstyle', loadChildren: './viewhairstyle/viewhairstyle.module#ViewhairstylePageModule' },
  { path: 'bookwithsalon', loadChildren: './bookwithsalon/bookwithsalon.module#BookwithsalonPageModule' },
  { path: 'booking', loadChildren: './booking/booking.module#BookingPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
