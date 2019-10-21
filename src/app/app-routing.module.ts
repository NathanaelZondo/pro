import { NgModule } from '@angular/core';
import { CanActivate,PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {GuardsGuard} from './guards.guard';
const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingPageModule)
  },
  
  {
    path: 'navigation',
    loadChildren: () => import('./navigation/navigation.module').then(m => m.NavigationPageModule)
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule',canActivate:[GuardsGuard]},
  { path: 'home',  loadChildren: './home/home.module#HomePageModule'},
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
  // { path: '**', loadChildren: './navigation/navigation.module#NavigationPageModule' },
  { path: 'maps', loadChildren: './maps/maps.module#MapsPageModule' },
  { path: 'success', loadChildren: './success/success.module#SuccessPageModule' },
  { path: 'info', loadChildren: './info/info.module#InfoPageModule' },
  { path: 'reviews', loadChildren: './reviews/reviews.module#ReviewsPageModule' },
  { path: 'onboarding', loadChildren: './onboarding/onboarding.module#OnboardingPageModule' },
  { path: 'navigation', loadChildren: './navigation/navigation.module#NavigationPageModule' },
  { path: 'customer', loadChildren: './customer/customer.module#CustomerPageModule'},
  { path: 'dates', loadChildren: './dates/dates.module#DatesPageModule'},
  { path: 'zero', loadChildren: './zero/zero.module#ZeroPageModule'}
]




@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
