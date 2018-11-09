import {Component, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {ServicesPage} from "../services/services";
import {AgentsPage} from "../agents/agents";
import {NewBPage} from "../new-b/new-b";
import {Storage} from '@ionic/storage';
import {ReviewPage} from "../review/review";

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {
    public districts : any;
    private AR: AyaxRest;
    public ipoteka = {
        service : 'ipoteka'
    };
    public yurist = {
        service : 'yurist'
    };
    public otsenka = {
        service : 'otsenka'
    };

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
    }

    goServicePage(serviceName) {
        this.navCtrl.push(ServicesPage, {
            service: serviceName
        });
    }

    startSearch() {
        let form: HTMLFormElement = this.element.nativeElement.querySelector(".js-search-form");
        let formData = new FormData(form);

        let filter = {
            contract: formData.get('contract'),
            category: formData.getAll('category[]'),
            district: formData.getAll('district[]')
        };

        this.storage.set('agentsFilter', filter).then(() => {
            this.navCtrl.push(AgentsPage);
        });
    }

    goNewB() {
        this.navCtrl.push(NewBPage);
    }

    public checkIt(node) {
        node.previousElementSibling.checked = !node.previousElementSibling.checked;
    }
}
