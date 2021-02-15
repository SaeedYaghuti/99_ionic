import { TestBed } from '@angular/core/testing';
import { KasabeService } from './kasabe.service';


describe('KasabeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KasabeService = TestBed.get(KasabeService);
    expect(service).toBeTruthy();
  });
});
