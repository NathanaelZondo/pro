import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReviewsPage } from './reviews.page';
import { IonicRatingModule } from 'ionic-rating';
import { StarRating } from 'ionic4-star-rating';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';

const routes: Routes = [
  {
    path: '',
    component: ReviewsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedmoduleModule,
    RouterModule.forChild(routes),
    IonicRatingModule
  ],
  declarations: [ReviewsPage,],
  
})
export class ReviewsPageModule {}
