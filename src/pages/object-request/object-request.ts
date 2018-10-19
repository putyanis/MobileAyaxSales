import {Component, ElementRef} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {MessText} from "../../classes/messtext";
import {AyaxRest} from "../../classes/ayaxrest";
import {Message} from "../../classes/message";

@IonicPage()
@Component({
    selector: 'page-object-request',
    templateUrl: 'object-request.html',
})
export class ObjectRequestPage {
    public objectCode: string;
    public agentID: number;

    private form: HTMLFormElement;
    private readonly MSG: any;
    private AR: AyaxRest;

    constructor(public navCtrl: NavController, public navParams: NavParams, private element: ElementRef, public alertCtrl: AlertController) {
        this.objectCode = navParams.get('code');
        this.agentID = navParams.get('agent');

        this.AR = new AyaxRest();
        this.MSG  = new Message(this.alertCtrl);
    }

    ionViewDidLoad() {
        this.form = this.element.nativeElement.querySelector('.js-objectrequest');
    }

    sendMessage() {
        this.AR.post('EstateObjectRequest', {
            agent: this.agentID,
            code: this.objectCode,
            name: this.form.userName.value,
            email: this.form.userEmail.value,
            phone: this.form.userPhone.value,
            message: this.form.userMessage.value,
        }).then((res) => {
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
