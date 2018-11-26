import {Component, ElementRef} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {Message} from "../../classes/message";
import {MessText} from "../../classes/messtext";
import {AyaxLoader} from "../../classes/ayaxloader";

@IonicPage()
@Component({
    selector: 'page-new-b',
    templateUrl: 'new-b.html',
})
export class NewBPage {
    public district: any;
    public rooms: any;
    public period: any;
    public price: any;

    private form: HTMLFormElement;
    private AR: AyaxRest;
    private MSG: Message;

    public loading: boolean = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private element: ElementRef,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
    ) {
        this.AR = new AyaxRest();
        this.MSG = new Message(alertCtrl);
    }

    ionViewDidLoad() {
        this.AR.get('NewBParams').then((res) => {
            this.district = res.data.district;
            this.rooms = res.data.rooms;
            this.period = res.data.period;
            this.price = res.data.price;
        });
        this.form = this.element.nativeElement.querySelector('.js-newb-request');
    }

    public sendMessage() {
        let loader = new AyaxLoader(this.loadingCtrl);

        loader.show();
        this.loading = true;

        this.AR.post('NewBRequest', {
            name: this.form.userName.value,
            phone: this.form.userPhone.value,
            message: this.compileMessage()
        }).then((res) => {
            loader.hide();
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

    private compileMessage() {
        let message = [];

        let districts = [];
        for (let i = 0; i < this.form.userDistrict.length; i++)
            if (this.form.userDistrict[i].checked)
                districts.push(this.form.userDistrict[i].value);

        let rooms = [];
        for (let i = 0; i < this.form.userRooms.length; i++)
            if (this.form.userRooms[i].checked)
                rooms.push(this.form.userRooms[i].value);

        let periods = [];
        for (let i = 0; i < this.form.userPeriod.length; i++)
            if (this.form.userPeriod[i].checked)
                periods.push(this.form.userPeriod[i].value);

        let prices = [];
        for (let i = 0; i < this.form.userPrice.length; i++)
            if (this.form.userPrice[i].checked)
                prices.push(this.form.userPrice[i].value);

        if (districts.length > 0)
            message.push('Район: ' + districts.join(', '));

        if (rooms.length > 0)
            message.push('Количество комнат: ' + rooms.join(', '));

        if (periods.length > 0)
            message.push('Срок сдачи: ' + periods.join(', '));

        if (prices.length > 0)
            message.push('Стоимость: ' + prices.join(', '));

        return message.join('; ');
    }

    public checkIt(node) {
        node.previousEспсlementSibling.checked = !node.previousElementSibling.checked;
    }
}
