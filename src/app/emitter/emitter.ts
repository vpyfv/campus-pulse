import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

export class Emitter {
  static authEmitter = new Subject<boolean>();
}
