import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KasabePage } from './kasabe.page';
import { KasabeRoutingModule } from './kasabe-routing.module';


@NgModule({
  declarations: [
    KasabePage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    KasabeRoutingModule,
  ],
  entryComponents: [
    // EditPostComponent
  ]
  
})
export class KasabePageModule {}
