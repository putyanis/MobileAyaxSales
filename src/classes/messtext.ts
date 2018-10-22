export class MessText {
    public static mess = {
        'LOGIN_ERROR_TITLE': 'Ошибка авторизации',
        'LOGIN_ERROR': 'Неправильный логин или пароль',
        'REGISTER_ERROR_TITLE' : 'Ошибка регистрации',
        'FORGET_ERROR_TITLE' : 'Ошибка',
        'FORGET_SUCCESS' : 'Пароль успешно изменен',
        'USER_UPDATE_ERROR_TITLE': 'Ошибка обновления пользователя',

        'REQUEST_ERROR_TITLE' : 'Ошибка отправки сообщения',
        'REQUEST_ERROR_TEXT' : 'Во время отправки сообщения произошла ошибка. Попробуйте повторить позже',
        'REQUEST_SUCCESS_TEXT' : 'Сообщение успешно отправлено',
        'USER_UPDATE_SUCCESS' : 'Данные успешно обновлены'
    };

    public static getMessage(msg : string) {
        return MessText.mess[msg];
    }
}