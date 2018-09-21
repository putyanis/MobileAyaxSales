import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {AyaxRest} from '../../classes/ayaxrest';
import {AyaxLoader} from '../../classes/ayaxloader';
import {Message} from '../../classes/message';
import {MessText} from "../../classes/messtext";

import {SearchPage} from "../search/search";
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'page-main',
    templateUrl: 'main.html',
})

export class MainPage {
    private readonly AR: any;
    private readonly MSG: any;
    private passwordTypeText = false;

    private emailControl: any;
    private passwordControl: any;
    private eyeControl: any;
    private loginControl: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                private storage: Storage
    ) {
        this.AR = new AyaxRest();
        this.MSG  = new Message(this.alertCtrl);

        this.storage.get('user').then((val) => {
            if (val && (val.registrationSkipped || val.id))
                this.navCtrl.push(SearchPage);
        });
    }

    ionViewDidLoad() {
        this.eyeControl = document.querySelector(".js-login-eye");
        this.emailControl = document.querySelector(".js-login-email");
        this.passwordControl = document.querySelector(".js-login-pass");
        this.loginControl = document.querySelector(".js-login-try");

        this.eyeControl.addEventListener("click", this.showPassword.bind(this));
        this.loginControl.addEventListener("click", this.tryLogin.bind(this));

        document.querySelector(".js-skip-auth").addEventListener("click", () => {
            this.storage.set('user', {
                registrationSkipped : true
            });
            this.navCtrl.push(SearchPage);
        });
    }

    showPassword() {
        if (this.passwordTypeText)
        {
            this.passwordControl.type = "password";
            this.eyeControl.classList.add("mdi-eye");
            this.eyeControl.classList.remove("mdi-eye-off");
        }
        else
        {
            this.passwordControl.type = "text";
            this.eyeControl.classList.add("mdi-eye-off");
            this.eyeControl.classList.remove("mdi-eye");
        }

        this.passwordTypeText = !this.passwordTypeText;
    }

    tryLogin() {
        let loader = new AyaxLoader(this.loadingCtrl);
        try
        {
            loader.show();

            let response = this.AR.post('User', {
                type: "login",
                login: this.emailControl.value,
                password: this.passwordControl.value
            });

            response.then((res) => {
                loader.hide();

                if (res.data.error)
                {
                    this.MSG.showErrorMessage(
                        MessText.getMessage('LOGIN_ERROR_TITLE'),
                        [
                            res.data.message
                        ]
                    );
                    return false;
                }

                this.storage.set('user', res.data);
                this.navCtrl.push(SearchPage);
            });
        }
        catch (e) {}
    }

    tryRegister() {

    }

    tryRestore() {

    }

    showLoginState() {

    }

    showRegistrationState() {

    }

    showRestoreState() {

    }
}