import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EntryDetailPage } from '../pages/entry-detail/entry-detail';
import { OrderByPipe } from '../pipes/order-by/order-by';
import { EntryDataServiceProvider } from '../providers/entry-data-service/entry-data-service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EntryDetailPage,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EntryDetailPage
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EntryDataServiceProvider
  ]
})
export class AppModule {}
