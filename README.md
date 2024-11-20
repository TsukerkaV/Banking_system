## Запуск проекта

1. Для запуска данного проекта вам понадобится nodejs и npm. Установите nodejs на свой компьютер, пакетный менеджер npm (Node Package Manager) по умолчанию устанавливается вместе c nodejs.
2. Склонируйте данный репозиторий. Перейдите в папку backend и в консоли выполните команду `npm start` для запуска сервера.
3. По умолчанию сервер слушает на 3000-ом порту localhost.
4. Чтобы запустить клиентскую часть приложения, перейдите в папку frontend и выполните команду `npm run dev`. Сборщик parsel отработает и приложение будет доступно по ссылке в консоли.

## Логин и пароль

На данный момент доступен только вход в следующий аккаунт:

- Логин: `developer`
- Пароль: `password`

## База данных

База данных bank_system разворачивается на порту 5432. Для ее реализации был использован postgreSQL версии 17.0.

## Документация

Вся документация находится в папке "out". Для её просмотра запустите файл global.html или home.html.

## Методы API

Все методы API отвечают объектом следующего общего формата:

{
payload, // любое произвольное значение, которое вернёт метод API (null, если произошла ошибка или невозможно вернуть какие-либо значимые данные)
error // текст описания/кода ошибки, которая произошла; заполняется, только если произошла ошибка. При успешном завершении работы метода здесь всегда будет пустая строка.
}

### В ответ вернёт payload следующего формата:

{ token }
где token — это строка, содержащая информацию для доступа к запросам, требующим авторизацию.

### Возможные ошибки:

Invalid password — пытаемся войти с неверным паролем;
No such user — пользователя с таким логином не существует.
В дальнейшем токен указывается в заголовке Authorization для методов, которые требуют авторизации: Authorization: Basic TOKEN, где TOKEN заменяем на значение токена, которое мы получили.

Если мы запрашиваем какой-либо метод и он возвращает ошибку Unauthorized, это означает, что мы забыли предоставить заголовок с токеном при вызове метода.

### GET /accounts

Возвращает список счетов пользователя.
Ответом будет массив с информацией об счёте пользователя примерно в таком формате:

[
{
"account": "74213041477477406320783754",
"balance": 0,
"transactions": [
{
"amount": 1234,
"date": "2021-09-11T23:00:44.486Z",
"from": "61253747452820828268825011",
"to": "74213041477477406320783754"
}
]
}
]
Примечание: данный метод возвращает только последнюю транзакцию из истории транзакций.

### GET /account/{id}

Метод возвращает подробную информацию о счёте пользователя, где {id} в адресе метода — это номер счёта.

Формат ответа примерно такой:

[
{
"account": "74213041477477406320783754",
"balance": 0,
"transactions": [
{
"amount": 1234,
"date": "2021-09-11T23:00:44.486Z",
"from": "61253747452820828268825011",
"to": "74213041477477406320783754"
}
]
}
]
Примечание: данный метод возвращает полную историю транзакций по счёту.

### POST /create-account

Метод создаёт для пользователя новый счёт, тело запроса не важно.

Отвечает объектом с информацией о новом созданном счёте:

    "43123747452820828268825011": {
    	"account": "43123747452820828268825011",
    	"balance": 0,
    	"mine": false,
    	"transactions": []
    },

### POST /transfer-funds

Метод перевода средств со счёта на счёт.

Тело запроса:

{
from, // счёт с которого списываются средства
to, // счёт, на который зачисляются средства
amount // сумма для перевода
}
Метод отвечает объектом счёта, с которого был произведён перевод.

Возможнные ошибки:

Invalid account from — не указан адрес счёта списания, или этот счёт не принадлежит нам;
Invalid account to — не указан счёт зачисления, или этого счёта не существует;
Invalid amount — не указана сумма перевода, или она отрицательная;
Overdraft prevented — мы попытались перевести больше денег, чем доступно на счёте списания.

### GET /all-currencies

Метод отвечает массивом со списком кодов всех используемых бекэндом валют на данный момент, например:

[ 'ETH', 'BTC', 'USD' ]

### GET /currencies

Метод возвращает список валютных счетов текущего пользователя.
Отвечает объектом с информацией о балансах валютных счетов данного пользователя:

{
"AUD": {
"amount": 22.16,
"code": "AUD"
},
"BTC": {
"amount": 3043.34,
"code": "BTC"
},
"BYR": {
"amount": 48.75,
"code": "BYR"
},
}

### POST /currency-buy

Метод совершения валютного обмена.

Тело запроса:

{
from, // код валютного счёта, с которого списываются средства
to, // код валютного счёта, на который зачисляются средства
amount // сумма, которая списывается, конвертация вычисляется сервером автоматически, исходя из текущего валютного курса для данной валютной пары
}
Метод отвечает объектом с информацией о балансах валютных счетов данного пользователя (см. /currencies).

Возможнные ошибки:

Unknown currency code — передан неверный валютный код, код не поддерживается системой (валютный код списания или валютный код зачисления);
Invalid amount — не указана сумма перевода, или она отрицательная;
Not enough currency — на валютном счёте списания нет средств; Overdraft prevented — попытка перевести больше, чем доступно на счёте списания.

### Websocket /currency-feed

Это websocket-стрим, который будет выдавать сообщения об изменении курса обмена валют.

Формат сообщения:

{
"type":"EXCHANGE_RATE_CHANGE",
"from":"NZD",
"to":"CHF",
"rate":62.79,
"change":1
}
где:

type — тип сообщения, которое можно использовать, чтобы отфильтровать данное сообщение от любых других типов сообщений, если таковые будут приходить;
from — код валюты, из которой производится конвертирование;
to — код валюты, в которую производится конвертирование;
rate — курс обмена вышеприведённых валют;
change — изменение курса по отношению к предыдущему значению: 1 — возрастание курса, -1 — убывание курса, 0 — курс не изменился.

### GET /banks

Метод возвращает список точек, отмечающих места банкоматов:

[
{ lat: 44.878414, lon: 39.190289 },
{ lat: 44.6098268, lon: 40.1006606 }
]
где lat — широта, lon — долгота.
