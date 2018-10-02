import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';

import {AyaxRest} from '../../classes/ayaxrest';
import {AyaxLoader} from '../../classes/ayaxloader';
import {Message} from '../../classes/message';
import {MessText} from "../../classes/messtext";
import {StrTools} from "../../classes/strtools";

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
    private loginForm: any;
    private state : string = 'login';
    private activeForm : HTMLFormElement;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                private storage: Storage
    ) {
        this.AR = new AyaxRest();
        this.MSG  = new Message(this.alertCtrl);

        // this.storage.clear();

        this.storage.get('user').then((val) => {
            if (val && (val.registrationSkipped || val.id))
                this.navCtrl.push(SearchPage);
        });

        // this.storage.get('loginState').then((val) => {
        //     if (val)
        //         this.state = val.state;
        // });
    }

    ionViewDidLoad() {
        this.loginForm = document.querySelector(".js-login-form");
        this.loginForm.addEventListener("click", this.processForm.bind(this));

        document.querySelector(".js-skip-auth").addEventListener("click", () => {
            this.storage.set('user', {
                registrationSkipped : true
            });
            this.navCtrl.push(SearchPage);
        });

        this.showState(this.state);
    }

    processForm(event) {
        event.preventDefault();
        try {
            let [actionType, actionName] = event.target.dataset.action.split("-");
            switch (actionType) {
                case 'try':
                    this['try' + StrTools.capitalize(actionName)]();
                    break;
                case 'show':
                    this.showState(actionName);
                    break;
                case 'type':
                    this.changeInputType(event.target);
                    break;
            }
        }
        catch (e) {}
    }

    showState(stateID: string, stateData: object = {}) {
        let states = this.loginForm.querySelectorAll("form[class*='state'");
        states.forEach((state) => {
            state.style.display = state.classList.contains("js-" + stateID + "-state") ? "block" : "none";
            if (state.style.display == "block") {
                this.activeForm = state;
                this.state = stateID;

                let capitalizedStateID = StrTools.capitalize(stateID);
                if (this["init" + capitalizedStateID + "State"])
                    this["init" + capitalizedStateID + "State"](stateData);
            }
        });
    }

    changeInputType(target) {
        let passwordInput = target.parentNode.querySelector(".js-login-pass");
        if (passwordInput.type == "text")
        {
            passwordInput.type = "password";
            target.classList.add("mdi-eye");
            target.classList.remove("mdi-eye-off");
        }
        //type == password
        else
        {
            passwordInput.type = "text";
            target.classList.add("mdi-eye-off");
            target.classList.remove("mdi-eye");
        }
    }

    tryLogin() {
        let loader = new AyaxLoader(this.loadingCtrl);
        try
        {
            loader.show();
            let formData = new FormData(this.activeForm);

            let response = this.AR.post('User', {
                type: "login",
                login: formData.get("email"),
                password: formData.get("password")
            });

            response.then((res) => {
                loader.hide();

                if (res.data.error)
                {
                    this.MSG.showErrorMessage(MessText.getMessage('LOGIN_ERROR_TITLE'), [
                        res.data.message
                    ]);
                    return false;
                }

                this.storage.set('user', res.data);
                this.navCtrl.push(SearchPage);
            });
        }
        catch (e) {}
    }

    tryRegister() {
        let loader = new AyaxLoader(this.loadingCtrl);
        try
        {
            loader.show();
            let formData = new FormData(this.activeForm);

            let response = this.AR.post('User', {
                type: "register",
                login: formData.get("email"),
                password: formData.get("password")
            });

            response.then((res) => {
                loader.hide();

                if (res.data.error)
                {
                    this.MSG.showErrorMessage(MessText.getMessage('REGISTER_ERROR_TITLE'), [
                        res.data.message
                    ]);
                    return false;
                }

                this.storage.set('user', res.data);
                this.navCtrl.push(SearchPage);
            });
        }
        catch (e) {}
    }

    tryRestore1() {
        let loader = new AyaxLoader(this.loadingCtrl);
        try
        {
            loader.show();
            let formData = new FormData(this.activeForm);

            let response = this.AR.post('User', {
                type: "forget",
                login: formData.get("email"),
                step: 1
            });

            response.then((res) => {
                loader.hide();

                if (res.data.error)
                {
                    this.MSG.showErrorMessage(MessText.getMessage('FORGET_ERROR_TITLE'), [
                        res.data.message
                    ]);
                    return false;
                }

                if (res.data.restorePasswordSent) {
                    this.showState('restore2', {
                        email : formData.get("email")
                    });
                }
            });
        }
        catch (e) {}
    }

    tryRestore2() {
        let loader = new AyaxLoader(this.loadingCtrl);
        try
        {
            loader.show();
            let formData = new FormData(this.activeForm);

            let response = this.AR.post('User', {
                type: "forget",
                login: formData.get("email"),
                code: formData.get("code"),
                password: formData.get("password"),
                step: 2
            });

            response.then((res) => {
                loader.hide();

                if (res.data.error)
                {
                    this.MSG.showErrorMessage(MessText.getMessage('FORGET_ERROR_TITLE'), [
                        res.data.message
                    ]);
                    return false;
                }

                if (res.data.passwordChanged) {
                    let successMessage = this.MSG.showSuccessMessage(MessText.getMessage(''), [
                        MessText.getMessage('FORGET_SUCCESS')
                    ]);

                    successMessage.then(() => {
                        this.showState('login');
                    });
                }
            });
        }
        catch (e) {}
    }

    initRestore2State(stateData: any) {
        let emailControl: HTMLInputElement = this.activeForm.querySelector("[name='email']");
        emailControl.value = stateData.email;
    }
}