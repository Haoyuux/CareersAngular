import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

type PlaceLite = {
  id: string;
  displayName: string;
  formattedAddress: string;
  lat: number;
  lon: number;
  raw?: any; // keep raw Nominatim result if you want
};

type NominatimResult = {
  place_id: number | string;
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
  class?: string;
  type?: string;
  importance?: number;
};

@Component({
  selector: 'app-place-search-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './place-search-component.component.html',
  styleUrls: ['./place-search-component.component.scss'],
})
export class PlaceSearchComponentComponent {
  @ViewChild('autocompleteInput', { static: true })
  autocompleteInput!: ElementRef<HTMLInputElement>;

  // UI state
  query = '';
  isLoading = false;
  errorMessage = '';
  showError = false;

  // Results / selection
  suggestions: PlaceLite[] = [];
  places: PlaceLite[] = []; // last picked item at index 0
  activeIndex = -1;

  // debounce + cancellation
  private debounceHandle: any = null;
  private activeController: AbortController | null = null;

  // --- Public handlers ---

  onInput(): void {
    const q = this.query.trim();

    // Reset visual state
    this.showError = false;
    this.errorMessage = '';
    this.activeIndex = -1;

    // Debounce
    if (this.debounceHandle) clearTimeout(this.debounceHandle);
    if (!q) {
      this.suggestions = [];
      return;
    }

    this.debounceHandle = setTimeout(() => {
      this.searchNominatim(q);
    }, 400);
  }

  onKeyDown(evt: KeyboardEvent): void {
    if (!this.suggestions.length) return;

    if (evt.key === 'ArrowDown') {
      evt.preventDefault();
      this.activeIndex = Math.min(
        this.activeIndex + 1,
        this.suggestions.length - 1
      );
      this.scrollActiveIntoView();
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
      this.scrollActiveIntoView();
    } else if (evt.key === 'Enter') {
      if (this.activeIndex >= 0) {
        evt.preventDefault();
        this.selectSuggestion(this.suggestions[this.activeIndex]);
      }
    } else if (evt.key === 'Escape') {
      this.suggestions = [];
      this.activeIndex = -1;
    }
  }

  selectSuggestion(item: PlaceLite): void {
    this.query = item.displayName; // or item.formattedAddress if you prefer
    this.suggestions = [];
    this.activeIndex = -1;

    // Store picked place (normalize shape)
    this.places = [item];

    // Optional: toast/alert
    alert(`Selected Place:\n${item.displayName}\n${item.formattedAddress}`);
  }

  // --- Core search ---

  private async searchNominatim(query: string): Promise<void> {
    // Cancel in-flight
    if (this.activeController) this.activeController.abort();
    this.activeController = new AbortController();

    // Build URL
    // Tip: add "&countrycodes=ph" if you want to prefer PH results
    // Tip: add "&viewbox=" + bbox + "&bounded=1" to restrict to a map area
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=10&q=${encodeURIComponent(
      query
    )}&accept-language=en`;

    this.isLoading = true;

    try {
      const res = await fetch(url, {
        signal: this.activeController.signal,
        headers: {
          Accept: 'application/json',
          // Do not set User-Agent from the browser; Referer will be present automatically.
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = (await res.json()) as NominatimResult[];

      this.suggestions = json.map((r) => {
        const formatted = r.display_name;
        return {
          id: String(r.place_id),
          displayName: formatted, // you can compose a shorter label if you like
          formattedAddress: formatted,
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
          raw: r,
        };
      });

      if (!this.suggestions.length) {
        this.showErrorMessage('No results found for your search.');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // quietly ignore — this was canceled by another keystroke
        return;
      }
      console.error('Nominatim search failed:', err);
      this.showErrorMessage('Failed to search. Please try again in a moment.');
    } finally {
      this.isLoading = false;
    }
  }

  // --- helpers ---

  private scrollActiveIntoView(): void {
    const container = document.querySelector('.ac-panel');
    const active = document.querySelector('.ac-item.active');
    if (container && active) {
      const c = container as HTMLElement;
      const a = active as HTMLElement;
      const cRect = c.getBoundingClientRect();
      const aRect = a.getBoundingClientRect();

      if (aRect.bottom > cRect.bottom)
        c.scrollTop += aRect.bottom - cRect.bottom;
      if (aRect.top < cRect.top) c.scrollTop -= cRect.top - aRect.top;
    }
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
  }
}
