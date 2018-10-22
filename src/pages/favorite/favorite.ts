import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {Categories} from "../../classes/categories";

@IonicPage()
@Component({
    selector: 'page-favorite',
    templateUrl: 'favorite.html',
})
export class FavoritePage {
    private AR: AyaxRest;

    private nextPage: number = 1;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.AR.get('UserFavorite', {

        }).then((res) => {
            let codes = [];
            for (let object of res.data)
            {
                codes.push(object.CODE);
            }

            console.log(codes);
        });
    }

}
