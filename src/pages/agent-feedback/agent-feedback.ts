import {Component, ElementRef} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {Message} from "../../classes/message";
import {MessText} from "../../classes/messtext";

@IonicPage()
@Component({
    selector: 'page-agent-feedback',
    templateUrl: 'agent-feedback.html',
})

export class AgentFeedbackPage {
    public agentName: string;

    private form: HTMLFormElement;
    private agentID: number;
    private agentEmail: string;
    private AR: AyaxRest;
    private readonly MSG: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private element: ElementRef,
                public alertCtrl: AlertController,
            ) {
        this.agentName = navParams.get('displayNameD');
        this.agentID = navParams.get('id');
        this.AR = new AyaxRest();
        this.MSG  = new Message(this.alertCtrl);
    }

    ionViewDidLoad() {
        this.form = this.element.nativeElement.querySelector(".js-agentfeedback");
    }

    public sendMessage() {
        this.AR.post('AgentRequest', {
            agent: this.agentID,
            agentEmail: this.agentEmail,
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