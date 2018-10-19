import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {MenuController, NavController} from "ionic-angular";
import {Storage} from '@ionic/storage';

import {AyaxRest} from '../../classes/ayaxrest';
import {SearchPage} from "../../pages/search/search";

@Component({
    selector: 'ayax-header',
    templateUrl: 'ayax-header.html'
})

export class AyaxHeaderComponent implements AfterViewInit {
    private header : HTMLElement;
    private burger : HTMLElement;

    public avatar: string;
    public displayName: string;
    public favoriteCount: number;
    public compareCount: number;

    private AR: AyaxRest;

    constructor(public navCtrl: NavController,
                public menu: MenuController,
                public storage: Storage,
                private element: ElementRef
    ) {
        this.AR = new AyaxRest();
    }

    ngAfterViewInit() {
        this.header = this.element.nativeElement.querySelector(".js-header");
        this.burger = this.header.querySelector(".js-burger");

        try
        {
            this.burger.addEventListener("click", () => {
                this.menu.toggle();
            });

            this.storage.get('user').then((val) => {
                if (val.avatar)
                    this.avatar = val.avatar.src;

                this.displayName = val.displayName;
            });

            this.AR.get('UserServices').then((res) => {
                this.favoriteCount = res.data.favorite;
                this.compareCount = res.data.compare;
            });

            let logo = document.querySelector(".js-logo");
            if (logo)
                logo.addEventListener("click", () => {
                    this.navCtrl.push(SearchPage);
                });
        }
        catch (e) {
            console.log(e);
        }
    }

}
