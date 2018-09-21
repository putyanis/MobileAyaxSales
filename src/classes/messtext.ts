export class MessText {
    public static mess = {
        'LOGIN_ERROR_TITLE': 'Ошибка авторизации',
        'LOGIN_ERROR': 'Неправильный логин или пароль'
    };

    public static getMessage(msg : string) {
        return MessText.mess[msg];
    }
}