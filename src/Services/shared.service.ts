import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  private selectedSousCategorieId = new BehaviorSubject<number | null>(null);
  selectedSousCategorieId$ = this.selectedSousCategorieId.asObservable();

  setSousCategorie(id: number) {
    this.selectedSousCategorieId.next(id);
  }
}
