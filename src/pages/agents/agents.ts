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
    public agents: any;

    private AR: AyaxRest;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.AR.get('SellAgent', {
            filter: this.navParams.get('filter')
        }).then((res) => {
            this.agents = res.data.rows;
            console.log(this.agents);
        });
    }

    openAgentPage(agentID) {
        this.navCtrl.push(AgentPage, {
            filter: this.navParams.get('filter'),
            type: agentID
        });
    }

    addActiveClass(i, rate) {
        return i <= rate;
    }
}
