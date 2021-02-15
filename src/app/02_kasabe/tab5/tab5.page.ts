import { Component, OnInit } from '@angular/core';
import { KasabeService } from '../kasabe.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  private thisMerchant = null;

  constructor(
    private kasabeService: KasabeService,
  ) { }

  ngOnInit() {
    this.thisMerchant = this.kasabeService.merchantFetchById(1);
  }

}
