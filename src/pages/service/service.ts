import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";

@IonicPage()
@Component({
    selector: 'page-service',
    templateUrl: 'service.html',
})
export class ServicePage {
    private AR: AyaxRest;
    public serviceTitle: string;
    public serviceHTML: string;
    public servicePrice: any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.AR.get('Service/' + this.navParams.get('id')).then((res) => {
            this.serviceTitle = res.data.name;
            this.serviceHTML = res.data.text;
            this.servicePrice = res.data.price;
        });
    }

    openServiceForm(serviceName) {
        console.log(serviceName);
    }
}
