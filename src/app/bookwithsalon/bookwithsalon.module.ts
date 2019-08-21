import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookwithsalonPage } from './bookwithsalon.page';

const routes: Routes = [
  {
    path: '',
    component: BookwithsalonPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BookwithsalonPage]
})
export class BookwithsalonPageModule {}
