import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides, Events} from 'ionic-angular';
import {Categories} from "../../classes/categories";
import {AyaxRest} from "../../classes/ayaxrest";

@IonicPage()
@Component({
    selector: 'page-compare',
    templateUrl: 'compare.html',
})
export class ComparePage {
    @ViewChild(Slides) slides: Slides;

    private AR: AyaxRest;
    private category: string = null;
    private codes: any = [];

    public currentIndex: number = 1;
    public objects: any = [];
    public userCategories: any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private element: ElementRef, public events: Events) {
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.AR.get('UserServices', {
            type: 'cat'
        }).then((res) => {
            this.userCategories = Object.keys(res.data.compare);

            if (this.userCategories && this.userCategories.length == 0)
            {
                this.userCategories = null;
                this.objects = null;
            }
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

            let index = 0;
            for (let object of res.data.rows) {
                this.codes.push(object.CODE);
                this.objects[index++] = false;
            }

            this.loadObject(0);
        });
    }

    public slideChanged() {
        let activeIndex = this.slides.getActiveIndex();
        this.currentIndex = (activeIndex + 1) > this.objects.length ? this.objects.length : activeIndex + 1;
        this.loadObject(activeIndex);
    }

    public loadPrevSlide() {
        this.slides.slidePrev();
    }

    public loadNextSlide() {
        this.slides.slideNext();
    }

    private loadObject(index) {
        if (this.objects[index] !== false)
            return true;

        this.AR.get('EstateObject/' + this.codes[index] + '/?schema=1').then((res) => {
            let properties = [];
            for (let s of res.data.schema) {
                if (res.data.object[s.code])
                {
                    let val = '-';
                    if (res.data.object[s.code + 'Text'] && res.data.object[s.code + 'Text'].length > 0)
                        val = res.data.object[s.code + 'Text'];
                    if (val == '-' && res.data.object[s.code] && res.data.object[s.code].length > 0)
                        val = res.data.object[s.code];

                    properties.push({
                        name: s.title,
                        value: val
                    });
                }
            }

            this.objects[index] = {
                properties: properties,
                compare: res.data.services.compare,
                favorite: res.data.services.favorite,
                photos: res.data.object.photos,
                currentPhoto: res.data.object.photos[0],
                currentPhotoIndex: 0,
                symCode: res.data.object.symCode
            };
        });
    }

    public showPrevPhoto() {
        let realIndex = this.currentIndex - 1;
        let probablyNextPhoto = this.objects[realIndex].currentPhotoIndex - 1;

        if (!this.objects[realIndex].photos[probablyNextPhoto])
            return false;

        this.objects[realIndex].currentPhotoIndex = probablyNextPhoto;
        this.updatePhoto();
    }

    public showNextPhoto() {
        let realIndex = this.currentIndex - 1;
        let probablyNextPhoto = this.objects[realIndex].currentPhotoIndex + 1;

        if (!this.objects[realIndex].photos[probablyNextPhoto])
            return false;

        this.objects[realIndex].currentPhotoIndex = probablyNextPhoto;
        this.updatePhoto();
    }

    private updatePhoto() {
        let realIndex = this.currentIndex - 1;
        this.objects[realIndex].currentPhoto = this.objects[realIndex].photos[ this.objects[realIndex].currentPhotoIndex ];
    }

    public addToFavorite() {
        let realIndex = this.currentIndex - 1;
        let object = this.objects[realIndex];

        if (parseInt(object.favorite) == 0)
        {
            this.AR.post('UserFavorite', {
                code: object.symCode,
                category: this.category
            }).then((res) => {
                this.objects[realIndex].favorite = res.data.id;
                this.fireUpdateService();
            });
        }
        else
        {
            this.AR.delete('UserFavorite', {
                id: object.favorite
            }).then((res) => {
                this.objects[realIndex].favorite = 0;
                this.fireUpdateService();
            });
        }
    }

    private fireUpdateService() {
        this.events.publish('user:updateServices', {});
    }

    public deleteCompare() {
        let realIndex = this.currentIndex - 1;
        let object = this.objects[realIndex];

        this.AR.delete('UserCompare', {
            id: object.compare
        }).then((res) => {
            this.fireUpdateService();
            this.resetPage();
        });
    }

    private resetPage() {
        this.category = null;
        this.codes = [];

        this.currentIndex = 1;
        this.objects = [];
        this.userCategories = [];
        this.ionViewDidLoad();
    }
}
