import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideToastr({
      timeOut: 2000,
      preventDuplicates: true,
      positionClass: 'toast-bottom-right',
    }),
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'saladejuegos-7fac5',
          appId: '1:1092387790068:web:7203befad9598c58e3d2a1',
          storageBucket: 'saladejuegos-7fac5.appspot.com',
          apiKey: 'AIzaSyCHMzyPGz4a2yhQggh93Rt7X0DYiFVgNSU',
          authDomain: 'saladejuegos-7fac5.firebaseapp.com',
          messagingSenderId: '1092387790068',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    provideHttpClient(),
  ],
};
