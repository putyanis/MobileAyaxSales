import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {ServicePage} from "../service/service";

@IonicPage()
@Component({
    selector: 'page-services',
    templateUrl: 'services.html',
})
export class ServicesPage {
    public services : any;

    private AR;
    private serviceType: string;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.AR = new AyaxRest();
        this.serviceType = navParams.get('service');
    }

    ionViewDidLoad() {
        this.AR.get('Service', {
            type: this.navParams.get('service')
        }).then((res) => {
            this.services = res.data.rows;
        });
    }

    openService(serviceID) {
        this.navCtrl.push(ServicePage, {
            serviceType: this.serviceType,
            id: serviceID
        });
    }
}
