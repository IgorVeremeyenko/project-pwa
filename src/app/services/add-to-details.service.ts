import { Injectable } from '@angular/core';
import { Client } from '../interfaces/client';

@Injectable({
  providedIn: 'root'
})
export class AddToDetailsService {

  items: Client[] = [];

  constructor() { }

  addItem(client: Client): void {
    this.items.push(client);
  }
  getItems(): Client[]{
    return this.items;
  }

  clearCart(): void {
    this.items = [];
  }
}
