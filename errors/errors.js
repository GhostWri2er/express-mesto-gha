const OK = 200;
const ERROR_CODE = 400; //переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;
const NOT_FOUND = 404;//карточка или пользователь не найден.
const SERVER_ERROR = 500; //ошибка по-умолчанию.

module.exports = {
  ERROR_CODE, NOT_FOUND, SERVER_ERROR, OK
};