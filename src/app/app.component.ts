import {Component, ViewChild } from '@angular/core';
import {MenuController, Platform, Nav, Events} from 'ionic-angular';
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

    public user: any = null;

    public favoriteCount: number = 0;
    public compareCount: number = 0;
    public showEnterButton: boolean = true;
    public showToolbar: boolean = true;

    private AR: AyaxRest;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                public storage: Storage,
                public menu: MenuController,
                public events: Events
            ) {
        this.AR = new AyaxRest();
        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();
            // this.storage.clear();
            this.subscribeEvents();
            this.updateUserInfo();
        });
    }

    subscribeEvents() {
        this.nav.viewDidEnter.subscribe((data) => {
            this.showToolbar = this.nav.getActive().name != 'MainPage';
        });

        this.events.subscribe('user:skipRegistration', () => {
            this.skipRegistration();
        });

        this.events.subscribe('user:updateServices', () => {
            this.updateUserServices();
        });

        this.events.subscribe('user:updateUserInfo', (data) => {
            this.updateUserInfo(data);
        });
    }

    updateUserInfo(data = {openSearchPage: true}) {
        this.storage.get('user').then((user) => {
            if (user !== null && user.registrationSkipped == true)
            {
                this.loadSearchPage();
                return false;
            }

            this.AR.post('User', {
                type: 'check'
            }).then((res) => {
                if (res.data.isAuthorized === false)
                {
                    if (this.nav.getActive().name != 'MainPage')
                    {
                        this.storage.clear().then(() => {
                            this.nav.goToRoot({});
                        });
                    }

                    return false;
                }

                this.storage.set('user', res.data).then(() => {
                    this.user = res.data;
                    this.showEnterButton = !(this.user.hasOwnProperty('id') && parseInt(this.user.id) > 0);
                    this.updateUserServices();

                    if (data.openSearchPage == true)
                        this.loadSearchPage();
                });
            });
        });
    }

    updateUserServices() {
        this.AR.get('UserServices').then((res) => {
            this.favoriteCount = res.data.favorite;
            this.compareCount = res.data.compare;
        });
    }

    loadMainPage() {
        if (this.nav.getActive().name != 'SearchPage')
        {
            this.loadSearchPage();
            this.menu.close();
        }
    }

    loadFavorites() {
        this.nav.push(FavoritePage);
        this.menu.close();
    }

    loadCompare() {
        this.nav.push(ComparePage);
        this.menu.close();
    }

    loadSettingsPage() {
        this.nav.push(SettingsPage);
        this.menu.close();
    }

    loadLoginPage() {
        this.storage.set('user', {
            registrationSkipped : false
        });
        this.showToolbar = false;
        this.menu.close();
        this.nav.goToRoot({});
    }

    loadSearchPage() {
        this.nav.push(SearchPage);
    }

    skipRegistration() {
        this.showEnterButton = true;
        this.storage.set('user', {
            registrationSkipped: true
        }).then(() => {
            this.loadSearchPage();
        });
    }

    public showToolBar() {
        return this.showToolbar == true;
    }
}