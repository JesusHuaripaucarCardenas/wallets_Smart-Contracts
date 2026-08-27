import { Injectable } from '@angular/core';
import { BrowserProvider } from 'ethers';
import { Eip1193Provider } from '../interfaces';

Injectable({
  providedIn: 'root',
})
export class EthersProviderFactory {
  create(ethereum: Eip1193Provider): BrowserProvider {
    return new BrowserProvider(ethereum, 'any');
  }
}
