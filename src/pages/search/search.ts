import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {ServicesPage} from "../services/services";
import {AgentsPage} from "../agents/agents";

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {
    public districts : any;
    private AR: AyaxRest;

    constructor(public navCtrl: NavController,
                public navParams: NavParams
    ) {
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.AR.get('DicSellDistrict').then((res) => {
            this.districts = res.data.rows;
        });

        this.initView();
    }

    initView() {
        let startSearchBnt = document.querySelector(".js-start-search");
        if (startSearchBnt) {
            startSearchBnt.addEventListener("click", this.startSearch.bind(this));
        }

        let serviceButtons = document.querySelectorAll(".js-service");
        if (serviceButtons) {
            [].forEach.call(serviceButtons, (btn) => {
                btn.addEventListener("click", (event) => {
                    this.navCtrl.push(ServicesPage, {
                        service: btn.dataset.service
                    });
                });
            });
        }
    }

    startSearch() {
        let form: HTMLFormElement = document.querySelector(".js-search-form");
        let formData = new FormData(form);

        this.navCtrl.push(AgentsPage, {
            filter: {
                contract: formData.get('contract'),
                category: formData.getAll('category[]'),
                district: formData.getAll('district[]')
            }
        });
    }
}
