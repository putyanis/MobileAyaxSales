import { AlertController } from 'ionic-angular';

export class Message {
    constructor (public alertCtrl: AlertController) {}

    public showErrorMessage(title : string, messages: Array<string>) {
        let message = messages.join('<br>');

        let popup = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });

        popup.present();
    }
}