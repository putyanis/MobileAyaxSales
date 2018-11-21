import {Component, ElementRef} from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {AyaxRest} from "../../classes/ayaxrest";
import {Message} from '../../classes/message';
import {MessText} from "../../classes/messtext";

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})

export class SettingsPage {
    private form: HTMLFormElement;
    private readonly AR: AyaxRest;
    private readonly MSG: Message;

    public firstName: string = '';
    public lastName:string = '';
    public secondName: string = '';
    public email: string = '';
    public phone: string = '';

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public storage: Storage,
        private element: ElementRef,
        private events: Events,
        public alertCtrl: AlertController
        )
    {
        this.AR = new AyaxRest();
        this.MSG = new Message(this.alertCtrl);
    }

    ionViewDidLoad() {
        this.form = this.element.nativeElement.querySelector('.js-settings-form');

        this.storage.get('user').then((user) => {
            if (user.firstName)
                this.firstName = user.firstName;

            if (user.lastName)
                this.lastName = user.lastName;

            if (user.secondName)
                this.secondName = user.secondName;

            if (user.email)
                this.email = user.email;

            if (user.phone)
                this.phone = user.phone;

        });
    }

    saveUser() {
        let body = {
            firstName: this.form.firstName.value,
            lastName: this.form.lastName.value,
            secondName: this.form.secondName.value,
            email: this.form.email.value,
            phone: this.form.phone.value,
            password: this.form.newPass.value
        };

        this.AR.put('User', body).then((res) => {
            if (res.data.update == true)
            {
                this.MSG.showSuccessMessage('', [
                    MessText.getMessage('USER_UPDATE_SUCCESS')
                ]);
                this.events.publish('user:updateUserInfo', {
                    openSearchPage: false
                });
            }
            else
                this.MSG.showErrorMessage(MessText.getMessage('USER_UPDATE_ERROR_TITLE'), [
                    res.data.message
                ]);
        });
    }
}
