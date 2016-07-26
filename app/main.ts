import { provide } from '@angular/core';
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from './app.routes';

import { AppComponent } from './app.component';

bootstrap(AppComponent, [
  provideForms(),
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  provide(LocationStrategy, { useClass: PathLocationStrategy })
]);

