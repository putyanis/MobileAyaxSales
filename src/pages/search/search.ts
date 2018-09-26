import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams
    ) {

    }

    ionViewDidLoad() {

    }
}
