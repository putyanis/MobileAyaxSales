import {Component, ElementRef} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

import {MessText} from "../../classes/messtext";
import {AyaxRest} from "../../classes/ayaxrest";
import {Message} from "../../classes/message";

@IonicPage()
@Component({
    selector: 'page-service-request',
    templateUrl: 'service-request.html',
})
export class ServiceRequestPage {
    public serviceName: string;
    private serviceType: string;

    private form: HTMLFormElement;
    private readonly MSG: any;
    private AR: AyaxRest;

    public loading: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public element: ElementRef, public alertCtrl: AlertController) {
        this.serviceName = navParams.get('serviceName');
        this.serviceType = navParams.get('serviceType');

        this.AR = new AyaxRest();
        this.MSG  = new Message(this.alertCtrl);
    }

    ionViewDidLoad() {
        this.form = this.element.nativeElement.querySelector('.js-service-request');
    }

    sendMessage() {
        this.loading = true;
        this.AR.post('ServiceRequest', {
            serviceName: this.serviceName,
            serviceType: this.serviceType,
            name: this.form.userName.value,
            email: this.form.userEmail.value,
            phone: this.form.userPhone.value,
            message: this.form.userMessage.value,
        }).then((res) => {
            this.loading = false;

            if (res.data.status == 'fail')
                this.MSG.showErrorMessage(
                    MessText.getMessage('REQUEST_ERROR_TITLE'),
                    [
                        MessText.getMessage('REQUEST_ERROR_TEXT')
                    ]
                );
            else
            {
                this.MSG.showSuccessMessage(
                    '',
                    [
                        MessText.getMessage('REQUEST_SUCCESS_TEXT')
                    ]
                );
                this.form.reset();
            }
        });
    }
}
