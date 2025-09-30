import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserServices } from 'src/app/services/nswag/service-proxie';

export interface PlaceLite {
  id: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lon: number;
}

export interface NominatimResultDto {
  placeId: number;
  displayName: string;
  lat: number | string;
  lon: number | string;
  address?: { [k: string]: string };
}

@Component({
  selector: 'app-place-search-component-v1',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './place-search-component-v1.component.html',
  styleUrl: './place-search-component-v1.component.scss',
})
export class PlaceSearchComponentV1Component implements OnInit {
  @Output() filtersChanged = new EventEmitter<{ address: string }>();

  place = '';
  suggestions: PlaceLite[] = [];
  selectedPlace?: PlaceLite;

  isLoading = false;
  showError = false;
  errorMessage = '';
  activeIndex = -1;

  private debounceHandle: any;

  constructor(private http: HttpClient, private _userService: UserServices) {}
  ngOnInit(): void {
    this.onGetUserAddress();
  }

  onGetUserAddress() {
    this._userService.getUserProfileDetails().subscribe({
      next: (res) => {
        this.place = res.data.address ?? '';
      },
    });
  }

  get address(): string {
    return this.place;
  }
  // fired on (input)
  onInput(): void {
    const q = this.place.trim();
    this.showError = false;
    this.errorMessage = '';
    this.activeIndex = -1;

    if (this.debounceHandle) clearTimeout(this.debounceHandle);

    if (!q) {
      this.suggestions = [];
      // emit empty so parent clears address when user clears input
      this.emitFiltersChanged();
      return;
    }

    this.debounceHandle = setTimeout(() => {
      this.searchPlaces(q);
      // also emit while typing so parent can keep in sync
      this.emitFiltersChanged();
    }, 400);
  }

  // keyboard navigation
  onKeyDown(evt: KeyboardEvent): void {
    if (!this.suggestions.length) return;
    if (evt.key === 'ArrowDown') {
      evt.preventDefault();
      this.activeIndex = Math.min(
        this.activeIndex + 1,
        this.suggestions.length - 1
      );
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
    } else if (evt.key === 'Enter') {
      if (this.activeIndex >= 0) {
        evt.preventDefault();
        this.selectSuggestion(this.suggestions[this.activeIndex]);
      } else {
        // enter with no active item: still emit current text
        this.emitFiltersChanged();
      }
    } else if (evt.key === 'Escape') {
      this.suggestions = [];
      this.activeIndex = -1;
    }
  }

  // click or enter selection
  fillInputOnSelect = false; // toggle behavior

  selectSuggestion(item: PlaceLite) {
    this.selectedPlace = item;

    // Put the full formatted address into the input
    this.place = item.formattedAddress;

    this.suggestions = [];
    this.activeIndex = -1;
    this.emitFiltersChanged();
  }

  // call backend /api/user/search?q=
  private searchPlaces(query: string): void {
    this.isLoading = true;

    this._userService.search(query).subscribe({
      next: (res) => {
        this.suggestions = res.map((r) => ({
          id: String(r.place_id),
          name:
            r.address?.['city'] ??
            r.address?.['town'] ??
            r.address?.['village'] ??
            r.display_name?.split(',')[0] ??
            '(Unknown)',
          formattedAddress: r.display_name,
          lat: typeof r.lat === 'number' ? r.lat : parseFloat(String(r.lat)),
          lon: typeof r.lon === 'number' ? r.lon : parseFloat(String(r.lon)),
        }));
        this.showError = this.suggestions.length === 0;
        this.errorMessage = this.showError ? 'No results found.' : '';
      },
      error: (err) => {
        console.error('Search failed', err);
        this.showError = true;
        this.errorMessage = 'Search failed. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private emitFiltersChanged() {
    if (this.place) {
      this.filtersChanged.emit({
        address: this.place,
      });
    }
  }
}
