import {Component, ElementRef, ViewChild } from '@angular/core';
import {MenuController, NavController, Platform, Nav, Events} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {MainPage} from '../pages/main/main';
import {AyaxRest} from "../classes/ayaxrest";
import {SearchPage} from "../pages/search/search";
import {Storage} from "@ionic/storage";
import {ComparePage} from "../pages/compare/compare";
import {FavoritePage} from "../pages/favorite/favorite";
import {SettingsPage} from "../pages/settings/settings";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = MainPage;

    private header : HTMLElement;
    private burger : HTMLElement;

    public avatar: string;
    public displayName: string;
    public favoriteCount: number = 0;
    public compareCount: number = 0;
    public showEnterButton: boolean = false;
    public showToolbar: boolean = false;

    private AR: AyaxRest;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                private element: ElementRef,
                public storage: Storage,
                public menu: MenuController,
                public events: Events
            ) {
        this.AR = new AyaxRest();
        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();
            this.initHeader();
            this.navigationEvents();

            this.events.subscribe('user:skipRegistration', (data) => {
                this.showEnterButton = true;
            });
        });
    }

    navigationEvents() {
        this.nav.viewDidEnter.subscribe((data) => {
            this.showToolbar = this.nav.getActive().name != 'MainPage';
        });
    }

    initHeader() {
        this.header = this.element.nativeElement.querySelector(".js-header");
        this.burger = this.header.querySelector(".js-burger");

        try
        {
            this.storage.get('user').then((val) => {
                this.showEnterButton = val.registrationSkipped == true;

                if (val.avatar)
                    this.avatar = val.avatar.src;

                this.displayName = val.displayName;
            });

            this.AR.get('UserServices').then((res) => {
                this.favoriteCount = res.data.favorite;
                this.compareCount = res.data.compare;
            });
        }
        catch (e) {

        }
    }

    loadMainPage() {
        if (this.nav.getActive().name != 'SearchPage')
            this.nav.push(SearchPage);
    }

    loadFavorites() {
        this.nav.push(FavoritePage);
    }

    loadCompare() {
        this.nav.push(ComparePage);
    }

    loadSettingsPage() {
        this.nav.push(SettingsPage);
    }

    loadLoginPage() {
        this.storage.set('user', {
            registrationSkipped : false
        });
        this.menu.close();
        this.nav.push(MainPage);
    }
}

