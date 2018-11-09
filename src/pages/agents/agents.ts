import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {AgentPage} from "../agent/agent";
import {Storage} from "@ionic/storage";
import {SearchPage} from "../search/search";

@IonicPage()
@Component({
    selector: 'page-agents',
    templateUrl: 'agents.html',
})
export class AgentsPage {
    public agents: any = [];
    public pageLoaded: boolean = false;
    public loading: boolean = false;

    private AR: AyaxRest;
    private nextPage: number = 1;
    private filter: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
        this.AR = new AyaxRest();

    }

    ionViewDidLoad() {
        this.storage.get('agentsFilter').then((filter) => {
            if (filter === null)
                return this.nullPage();

            this.filter = filter;
            this.loadPage();
        });
    }

    public loadPage() {
        this.loading = true;
        this.AR.get('SellAgent', {
            filter: this.filter,
            paging: {
                size: 5,
                num: this.nextPage
            }
        }).then((res) => {
            if (res.data.rows && res.data.rows.length > 0) {
                this.agents = this.agents.concat(res.data.rows);
                this.nextPage = res.data.pager.next;
                this.pageLoaded = true;
                this.loading = false;
            }
            else {
                return this.nullPage();
            }
        });
    }

    nullPage() {
        this.agents = null;
        this.pageLoaded = true;
        this.nextPage = null;
        return false;
    }

    openAgentPage(agentEmail) {
        this.navCtrl.push(AgentPage, {
            filter: this.filter,
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

    returnToSearch() {
        this.navCtrl.push(SearchPage);
    }

}
