export class MessText {
    public static mess = {
        'LOGIN_ERROR_TITLE': 'Ошибка авторизации',
        'LOGIN_ERROR': 'Неправильный логин или пароль',
        'REGISTER_ERROR_TITLE' : 'Ошибка регистрации',
        'FORGET_ERROR_TITLE' : 'Ошибка',
        'FORGET_SUCCESS' : 'Пароль успешно изменен'
    };

    public static getMessage(msg : string) {
        return MessText.mess[msg];
    }
}