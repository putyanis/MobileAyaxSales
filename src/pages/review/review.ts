import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest, AyaxRestParams} from "../../classes/ayaxrest";

interface AgentReview {
    author: string,
    text: string,
    date: string
}

@IonicPage()
@Component({
    selector: 'page-review',
    templateUrl: 'review.html',
})

export class ReviewPage {
    public agentID: number;
    public reviews: Array<AgentReview> = [];
    public agent: any;
    public loading: boolean = false;
    private AR: AyaxRest;
    private nextPage: number = 1;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.agentID = this.navParams.get("id");
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.loadPage();
    }

    loadPage(iniByButton: boolean = false) {
        if (iniByButton)
            this.loading = true;

        this.AR.get('Review', {
            filter : {
                property_agent : this.agentID
            },
            paging : {
                num : this.nextPage
            }
        }).then((res) => {
            this.reviews = this.reviews.concat(res.data.rows);
            this.agent = res.data.agents[this.agentID];
            this.nextPage = res.data.pager.next;
            this.loading = false;
        });
    }
}
