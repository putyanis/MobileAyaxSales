import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {AgentPage} from "../agent/agent";

@IonicPage()
@Component({
    selector: 'page-agents',
    templateUrl: 'agents.html',
})
export class AgentsPage {
    public agents: any = [];

    private AR: AyaxRest;
    private nextPage: number = 1;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.loadPage();
    }

    public loadPage() {
        this.AR.get('SellAgent', {
            filter: this.navParams.get('filter'),
            paging: {
                size: 5,
                num: this.nextPage
            }
        }).then((res) => {
            this.agents = this.agents.concat(res.data.rows);
            this.nextPage = res.data.pager.next;
        });
    }

    openAgentPage(agentEmail) {
        this.navCtrl.push(AgentPage, {
            filter: this.navParams.get('filter'),
            agentEmail: agentEmail.replace('@ayax.ru', '')
        });
    }

    addActiveClass(i, rate) {
        return i <= rate;
    }

    getObjectsCount(objectCount) {
        let sum: number = 0;

        for (let key in objectCount) {
            sum += objectCount[key];
        }
        return sum;
    }
}
