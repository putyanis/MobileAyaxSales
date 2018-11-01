import {Component, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Categories} from "../../classes/categories";
import {AyaxRest} from "../../classes/ayaxrest";

@IonicPage()
@Component({
    selector: 'page-compare',
    templateUrl: 'compare.html',
})
export class ComparePage {
    private AR: AyaxRest;
    private category: string = null;

    public objects: any = [];
    public userCategories: any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private element: ElementRef) {
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.AR.get('UserServices', {
            type: 'cat'
        }).then((res) => {
            this.userCategories = Object.keys(res.data.compare);

            if (this.userCategories.length == 0)
                this.userCategories = null;
            else
                this.changeCategory(this.userCategories[0]);
        });
    }

    public showCategoryName(category) {
        return Categories.getRu(category);
    }

    public changeCategory(category: string) {
        this.category = category;
        this.objects = [];
        this.loadPage();
    }

    public loadPage() {
        this.AR.get('UserCompare', {
            filter: {
                category: this.category
            },
            order: {
                timestamp : 'desc'
            },
            paging: {
                size: 10
            },
            select: [
                'CODE'
            ]
        }).then((res) => {
            let activeLabel = this.element.nativeElement.querySelector(".js-category-label[for='chUserService" + this.category + "']");
            if (activeLabel) {
                activeLabel.parentNode.querySelector("input").checked = true;
            }

            let codes = [];
            for (let object of res.data.rows) {
                codes.push(object.CODE);
            }

            this.AR.get('EstateObject', {
                type: this.category,
                filter: {
                    code: codes
                }
            }).then((res) => {
                this.objects = this.objects.concat(res.data.rows);
            });
        });
    }
}
