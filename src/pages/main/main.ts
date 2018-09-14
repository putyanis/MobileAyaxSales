import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import axios from 'axios';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

  login() {
    // const ayax = axios.create();

    // axios.get('https://www.ayax.ru/api/v1/District/?filter=lt=44.950045;ln=38.924620', {
    //   auth: {
    //     username: 'restapiuser',
    //     password: 'tHt@F(*YYsjR7bV5U80c~x}72k-sFw'
    //   }
    // }).then(function(response){
    //   console.log(response);
    // });

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.ayax.ru/api/v1/District/?filter=lt=44.950045;ln=38.924620');
    xhr.setRequestHeader('Authorization', 'Basic cmVzdGFwaXVzZXI6dEh0QEYoKllZc2pSN2JWNVU4MGN+eH03Mmstc0Z3');
    xhr.addEventListener('load', function(response){
      console.log(response);
    });
    xhr.send();
  }

}
