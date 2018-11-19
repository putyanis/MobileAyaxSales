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
    public showEnterButton: boolean = true;
    public showToolbar: boolean = true;

    private isAuthorized: boolean = false;

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

            this.events.subscribe('user:updateServices', (data) => {
                this.updateUserServices();
            });

            this.events.subscribe('user:loggedIn', (data) => {
                this.updateUserInfo();
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
        // this.storage.clear();
        try
        {
            this.storage.get('user').then((user) => {
                if (user === null)
                {
                    if (this.nav.getActive().name != 'MainPage')
                    {
                        this.storage.clear().then(() => {
                            this.nav.goToRoot({});
                        });
                    }

                    return false;
                }

                this.showEnterButton = !(user.hasOwnProperty('id') && parseInt(user.id) > 0);

                this.AR.post('User', {
                    type: 'check'
                }).then((res) => {
                    if (res.data.isAuthorized == false)
                        this.showEnterButton = true;
                });

                if (user.avatar)
                    this.avatar = user.avatar.src;

                this.displayName = user.displayName;
            });

            this.updateUserServices();
        }
        catch (e) {

        }
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
            this.nav.push(SearchPage);
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
        this.menu.close();
        this.nav.goToRoot({});
        // this.nav.push(MainPage);
    }

    updateUserInfo() {
        this.AR.post('User', {
            type: 'check'
        }).then((res) => {
            this.storage.set('user', res.data).then(() => {
                this.initHeader();
            });
        });
    }
}

