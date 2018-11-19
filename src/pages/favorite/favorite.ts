import {Component, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {Categories} from "../../classes/categories";
import {ObjectPage} from "../object/object";

@IonicPage()
@Component({
    selector: 'page-favorite',
    templateUrl: 'favorite.html',
})
export class FavoritePage {
    private AR: AyaxRest;
    private nextPage: number = 1;
    private category: string = null;

    public objects: any = [];
    public userCategories: any = [];
    public pageLoaded = false;
    public loading = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private element: ElementRef) {
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.AR.get('UserServices', {
            type: 'cat'
        }).then((res) => {
            this.userCategories = Object.keys(res.data.favorite);

            if (this.userCategories.length == 0)
            {
                this.userCategories = null;
                this.objects = null;
                this.pageLoaded = true;
                this.loading = false;
            }
            else
                this.changeCategory(this.userCategories[0]);
        });
    }

    public loadPage(initByButton: boolean = false) {
        if (!initByButton)
            this.pageLoaded = false;

        if (initByButton)
            this.loading = true;

        this.AR.get('UserFavorite', {
            filter: {
                category: this.category
            },
            order: {
                timestamp : 'desc'
            },
            paging: {
                num: this.nextPage
            },
            select: [
                'CODE'
            ]
        }).then((res) => {
            let activeLabel = this.element.nativeElement.querySelector(".js-category-label[for='chUserService" + this.category + "']");
            if (activeLabel) {
                activeLabel.parentNode.querySelector("input").checked = true;
            }

            this.nextPage = res.data.pager.next;

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
                this.pageLoaded = true;
                this.loading = false;
            });
        });
    }

    public changeCategory(category: string) {
        this.category = category;
        this.nextPage = 1;
        this.objects = [];
        this.loadPage();
    }

    public showCategoryName(category) {
        return Categories.getRu(category);
    }

    public loadObject(code) {
        this.navCtrl.push(ObjectPage, {
            code: code
        });
    }
}
