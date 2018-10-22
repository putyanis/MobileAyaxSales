import {Component, ViewChild} from '@angular/core';
import {Slides, IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {AyaxRest} from "../../classes/ayaxrest";
import {ObjectRequestPage} from "../object-request/object-request";

@IonicPage()
@Component({
    selector: 'page-object',
    templateUrl: 'object.html',
})
export class ObjectPage {
    @ViewChild(Slides) slides: Slides;

    private AR: AyaxRest;
    public object: any;
    public properties: any = [];
    public objectName: string;
    public photos: any = [];
    public currentSlide: number = 1;
    public services: any = {
        favorite: 0,
        compare: 0
    };
    public similar: any = [];
    private code: string;
    private category: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
        this.code = navParams.get('code');
        this.AR = new AyaxRest();
    }

    ionViewDidLoad() {
        this.AR.get('EstateObject/' + this.code + '/?schema=1').then((res) => {
            this.object = res.data.object;
            this.objectName = res.data.object.name;
            this.photos = res.data.object.photos;
            this.code = res.data.object.code;
            this.category = res.data.object.iblockCode;

            for (let s of res.data.schema) {
                if (res.data.object[s.code])
                {
                    let val = '-';
                    if (res.data.object[s.code + 'Text'] && res.data.object[s.code + 'Text'].length > 0)
                        val = res.data.object[s.code + 'Text'];
                    if (val == '-' && res.data.object[s.code] && res.data.object[s.code].length > 0)
                        val = res.data.object[s.code];

                    this.properties.push({
                        name: s.title,
                        value: val
                    });
                }
            }

            this.services.compare = res.data.services.compare;
            this.services.favorite = res.data.services.favorite;

            let objectPrice = parseInt(res.data.object.price);

            this.AR.get('EstateObject', {
                filter: {
                    'property_price<=': objectPrice + (objectPrice * 0.1),
                    'property_price>=': objectPrice - (objectPrice * 0.1),
                    'id!': res.data.object.id,
                    'property_hl_city': res.data.object.hlCityCode,
                    'property_hl_district': res.data.object.hlDistrictCode
                },
                paging: {
                    size: 3
                },
                type: res.data.object.iblockCode
            }).then((res) => {
                this.similar = res.data.rows;
            });
        });
    }

    nextSlide() {
        this.slides.slideNext();
        this.currentSlide = 1 + this.slides.getActiveIndex();
    }

    prevSlide() {
        this.slides.slidePrev();
        this.currentSlide = 1 + this.slides.getActiveIndex();
    }

    slideChanged() {
        this.currentSlide = 1 + this.slides.getActiveIndex();
    }

    loadObject(code) {
        this.navCtrl.push(ObjectPage, {
            code: code
        });
    }

    addToFavorite() {
        if (this.services.favorite == 0)
        {
            this.AR.post('UserFavorite', {
                code: this.code,
                category: this.category
            }).then((res) => {
                this.services.favorite = res.data.id;
                this.fireUpdateService();
            });
        }
        else
        {
            this.AR.delete('UserFavorite', {
                id: this.services.favorite
            }).then((res) => {
                this.services.favorite = 0;
                this.fireUpdateService();
            });
        }
    }

    addToCompare() {
        if (this.services.compare == 0)
        {
            this.AR.post('UserCompare', {
                code: this.code,
                category: this.category
            }).then((res) => {
                this.services.compare = res.data.id;
                this.fireUpdateService();
            });
        }
        else
        {
            this.AR.delete('UserCompare', {
                id: this.services.compare
            }).then((res) => {
                this.services.compare = 0;
                this.fireUpdateService();
            });
        }
    }

    loadObjectRequest() {
        this.navCtrl.push(ObjectRequestPage, {
            code: this.object.code,
            agent: this.object.agent
        });
    }

    fireUpdateService() {
        this.events.publish('user:updateServices', {});
    }
}
