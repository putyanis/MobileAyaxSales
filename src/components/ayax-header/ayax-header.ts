import {Component} from '@angular/core';
import {MenuController, NavController} from "ionic-angular";
import {Storage} from '@ionic/storage';

import {AyaxRest} from '../../classes/ayaxrest';

@Component({
    selector: 'ayax-header',
    templateUrl: 'ayax-header.html'
})
export class AyaxHeaderComponent {
    private header : HTMLElement;
    private burger : HTMLElement;

    public avatar: string;
    public displayName: string;
    public favoriteCount: number;
    public compareCount: number;

    private AR: AyaxRest;

    constructor(public navCtrl: NavController,
                public menu: MenuController,
                public storage: Storage
    ) {
        this.AR = new AyaxRest();
    }

    ngAfterViewInit() {
        this.header = document.querySelector(".js-header");
        this.burger = this.header.querySelector(".js-burger");

        this.burger.addEventListener("click", this.toggleMenu.bind(this));

        this.storage.get('user').then((val) => {
            this.avatar = val.avatar.src;
            this.displayName = val.displayName;
        });

        this.AR.get('UserServices').then((res) => {
            this.favoriteCount = res.data.favorite;
            this.compareCount = res.data.compare;
        });
    }

    toggleMenu() {
        this.menu.toggle();
    }

}
