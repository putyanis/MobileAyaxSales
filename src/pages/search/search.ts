import {Component, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {ServicesPage} from "../services/services";
import {AgentsPage} from "../agents/agents";
import {NewBPage} from "../new-b/new-b";
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {
    public districts : any;
    private AR: AyaxRest;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private element: ElementRef,
                private storage: Storage
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
        let serviceButtons = this.element.nativeElement.querySelectorAll(".js-service");
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
        let form: HTMLFormElement = this.element.nativeElement.querySelector(".js-search-form");
        let formData = new FormData(form);

        this.navCtrl.push(AgentsPage, {
            filter: {
                contract: formData.get('contract'),
                category: formData.getAll('category[]'),
                district: formData.getAll('district[]')
            }
        });
    }

    goNewB() {
        this.navCtrl.push(NewBPage);
    }
}
