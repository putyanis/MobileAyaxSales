import axios from 'axios';

export interface AyaxRestParams {
    filter?: object,
    order?: object,
    select?: object,
    paging?: object
}

export class AyaxRest {
    private axiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL : 'https://www.ayax.ru/api/v1/',
            timeout: 5000,
            auth: {
                username: 'restapiuser',
                password: 'tHt@F(*YYsjR7bV5U80c~x}72k-sFw'
            },
            maxRedirects: 10,
            withCredentials: true,
            headers: {

            }
        });
    }

    public get(path: string, params: AyaxRestParams = {}) {
        return this.send('get', this.buildQuery(path, params));
    }

    public post(path: string, body: object) {
        return this.send('post', path + '/', body);
    }

    public put(path: string, body: object) {
        return this.send('put', path + '/', body);
    }

    public delete(path: string, body: object) {
        return this.send('delete', path + '/', body);
    }

    private send(method: string, path: string, body: object = {}) {
        return this.axiosInstance.request({
            method:  method,
            url: path,
            data: body
        });
    }

    private buildQuery(path: string, params: object = {}) {
        const base = [
            'filter', 'select', 'order', 'paging'
        ];
        let query = [];
        for (let groupName in params ) {
            if (base.indexOf(groupName) !== -1) {
                let subQuery = [];
                for (let paramName in params[groupName]) {
                    subQuery.push(paramName + '=' + params[groupName][paramName]);
                }
                query.push(groupName + '=' + subQuery.join(';'));
            }
            else {
                query.push(groupName + '=' + params[groupName]);
            }
        }
        let queryString = query.length > 0 ? '?' + query.join('&') : '';
        return path + '/' + queryString;
    }
}