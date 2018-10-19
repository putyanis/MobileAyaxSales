import {Component, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {ReviewPage} from "../review/review";
import {AgentFeedbackPage} from "../agent-feedback/agent-feedback";
import {ObjectPage} from "../object/object";

@IonicPage()
@Component({
    selector: 'page-agent',
    templateUrl: 'agent.html',
})

export class AgentPage {
    public agent: any;
    public agentObjectTypes : any;
    public objects: any;
    private categoryNames: any;
    private nextPage: number = 1;
    private category: string = null;
    private filter: any;

    private AR: AyaxRest;

    constructor(public navCtrl: NavController, public navParams: NavParams, private element: ElementRef) {
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.AR.get('SellAgent/' + this.navParams.get('agentEmail'), {
            filter: this.navParams.get('filter')
        }).then((res) => {
            this.agent = res.data.rows[0];
            this.categoryNames = res.data.categories;
            this.agentObjectTypes = Object.keys(this.agent.objectCount);

            //prepare object's filter
            this.filter = this.navParams.get('filter');
            this.filter.sellDistrict = this.filter.district;
            this.filter.agent = this.agent.id;
            delete this.filter.district;

            this.changeCategory(this.agentObjectTypes[0]);
        });
    }

    public displayRate() {
        let strRate:string = (new Number(this.agent.rate)).toFixed(1);
        return strRate.replace('.', ',');
    }

    public addActiveClass(i, rate) {
        return i <= rate;
    }

    public showCategoryName(category) {
        return this.categoryNames[category];
    }

    public changeCategory(category: string) {
        this.category = category;
        this.nextPage = 1;
        this.objects = [];
        this.loadPage();
    }

    public loadPage() {
        this.AR.get('EstateObject', {
            type: this.category,
            filter: this.filter,
            paging : {
                num : this.nextPage
            }
        }).then((res) => {
            this.objects = this.objects.concat(res.data.rows);

            let activeLabel = this.element.nativeElement.querySelector(".js-category-label[for='chAgent" + this.category + "']");
            if (activeLabel) {
                activeLabel.parentNode.querySelector("input").checked = true;
            }

            this.nextPage = res.data.pager.next;
        });
    }

    public loadAgentReviews() {
        this.navCtrl.push(ReviewPage, {
            id : this.agent.id
        });
    }

    public loadFeedbackPage() {
        this.navCtrl.push(AgentFeedbackPage, {
            id: this.agent.id,
            displayNameD: this.agent.displayNameD,
            email: this.agent.email
        });
    }

    public loadObject(code) {
        this.navCtrl.push(ObjectPage, {
            code: code
        });
    }
}
