import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable();

  constructor() {
    console.log('LoadingService constructor called');
  }

  get loading(): boolean {
    const value = this._loading.value;
    // console.log('LoadingService.loading getter called, returning:', value);
    return value;
  }

  set loading(value: boolean) {
    // console.log('LoadingService.loading setter called with:', value);
    this._loading.next(value);
  }

  show(): void {
    // console.log('LoadingService.show() called');
    this._loading.next(true);
  }

  hide(): void {
    // console.log('LoadingService.hide() called');
    this._loading.next(false);
  }
}
