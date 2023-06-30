import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

//@ts-ignore
window['ga-disable-G-30EFP1TEML'] = true;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

