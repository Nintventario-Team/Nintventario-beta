import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from "@angular/common/http";

import { routes } from './app.routes';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withHashLocation()),
    provideHttpClient(), provideNoopAnimations()]
};