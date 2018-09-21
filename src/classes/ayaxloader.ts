import {LoadingController} from "ionic-angular";

export class AyaxLoader {
    public loader : any;

    constructor (public loadingCtrl: LoadingController) {
        this.loader = loadingCtrl.create({
            cssClass : 'ayax-loader',
            enableBackdropDismiss : true,
            dismissOnPageChange : true,
            spinner : 'crescent'
        });
    }

    show() {
        this.loader.present();
    }

    hide() {
        this.loader.dismiss();
    }
}