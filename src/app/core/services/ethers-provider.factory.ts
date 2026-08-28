import { Injectable } from '@angular/core';
import { BrowserProvider } from 'ethers';
import { Eip1193Provider } from '../interfaces';

/**
 * Encapsula la creación de un ethers.BrowserProvider a partir del
 * proveedor EIP-1193 inyectado por Pali Wallet (window.ethereum).
 *
 * Se expone como un servicio inyectable (en vez de usar `new BrowserProvider(...)`
 * directamente en WalletService) para poder sustituirlo fácilmente por un
 * fake/mock en pruebas unitarias mediante Angular DI.
 */
@Injectable({
  providedIn: 'root',
})
export class EthersProviderFactory {
  create(ethereum: Eip1193Provider): BrowserProvider {
    // "any" le indica a Ethers que la red puede cambiar durante la vida del
    // provider (ej. el usuario cambia de Sepolia a Hoodi desde Pali Wallet).
    // Sin esto, Ethers v6 detecta la red una sola vez y lanza NETWORK_ERROR
    // ("network changed: X => Y") en la siguiente llamada tras el cambio.
    return new BrowserProvider(ethereum, 'any');
  }
}
