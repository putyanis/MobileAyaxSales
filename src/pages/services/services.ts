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
    public serviceSectionName: string = '';

    private AR;
    private serviceType: string;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.AR = new AyaxRest();
        this.serviceType = navParams.get('service');
    }

    ionViewDidLoad() {
        switch (this.navParams.get('service')){
            case 'ipoteka':
                this.serviceSectionName = 'Сопровождение ипотеки';
                break;
            case 'yurist':
                this.serviceSectionName = 'Юридические услуги';
                break;
            case 'otsenka':
                this.serviceSectionName = 'Оценка';
                break;
        }

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
