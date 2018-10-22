export class Categories {
    private static readonly categories = {
        'flat': 'квартиры',
        'house': 'дома',
        'land': 'участки',
        'commercial': 'коммерция',
        'shed': 'гаражи'
    };

    public static getRu(code) {
        return this.categories[code];
    }
}