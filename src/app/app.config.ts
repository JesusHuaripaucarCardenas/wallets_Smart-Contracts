import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { EthersProviderFactory } from './core/services/ethers-provider.factory';
import { NetworkService } from './core/services/network.service';
import { WalletService } from './core/services/wallet.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Registrados explícitamente (además de providedIn: 'root' en cada
    // servicio) para evitar el NG0201 "No provider found" que puede
    // aparecer con algunos builds de esbuild/vite cuando un servicio solo
    // se inyecta dentro de otro servicio y nunca dentro de un componente.
    EthersProviderFactory,
    NetworkService,
    WalletService,
  ]
};
