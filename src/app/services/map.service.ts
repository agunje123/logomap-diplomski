import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Kabinet } from '../model/kabinet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  kabinetSub = new Subject<Kabinet>();

  showKabinet(kabinet: Kabinet) {
    this.kabinetSub.next(kabinet);
  }
}
