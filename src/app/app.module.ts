import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {IonicStorageModule} from '@ionic/storage';

import {MyApp} from './app.component';
import {MainPage} from '../pages/main/main';
import {SearchPage} from "../pages/search/search";
import {ServicesPage} from "../pages/services/services";
import {ServicePage} from "../pages/service/service";
import {AgentPage} from "../pages/agent/agent";
import {AgentsPage} from "../pages/agents/agents";

import {AyaxHeaderComponent} from "../components/ayax-header/ayax-header";


@NgModule({
    declarations: [
        MyApp,
        MainPage,
        SearchPage,
        AyaxHeaderComponent,
        AgentPage,
        AgentsPage,
        ServicesPage,
        ServicePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        MainPage,
        SearchPage,
        AgentPage,
        AgentsPage,
        ServicesPage,
        ServicePage,
        AyaxHeaderComponent,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
