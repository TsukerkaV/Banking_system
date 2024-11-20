import { renderLogInForm } from "./logIn";
import { createLoader } from "./loader";
const SERVER_URL = 'http://localhost:3000';

/**
 * Функция для отправки ошибки
 * @param {Object} res - Ответ на запрос
 * @param {JSON} data - Данные, вернувшиеся в ответ на запрос
 */
function throwErr(res, data){
  if(res.status === 404 || data === null){
    throw new Error("Произошла ошибка, попробуйте обновить страницу позже");
  }
  if(res.status === 500){
    throw new Error("Произошла ошибка, попробуйте обновить страницу позже");
  }
}
/**
 * Функция для отлавливания ошибки
 * @param {Error} err - Объект ошибки
 *
 */
function catchErr(err){
  if(err.name === "SyntaxError" ){
    console.log("JSON Error: " + "Произошла ошибка, попробуйте обновить страницу позже");
    createErrorBox("Произошла ошибка, попробуйте обновить страницу позже");
  }
  if(err.name === "NetworkError" ){
    console.log("Network Error: " + "Произошла ошибка, проверьте подключение к интернету");
    createErrorBox("Произошла ошибка, проверьте подключение к интернету");
  }
  if(err.name === "Error"){
    console.log("Error"+ err.message);
    createErrorBox("Error"+ err.message);
  }
  else{
    throw err;
  }
}
/**
 * Функция для создания оповещения об ошибке
 * @param {string} message - Сообщение (текст ошибки)
 *
 */
function createErrorBox(message){
  const errBox = document.createElement('div');
  errBox.classList.add('error-box');
  errBox.textContent = message;
  document.body.append(errBox);
  setTimeout(()=>{
    errBox.classList.add('hide');
  },3000);
}
window.addEventListener("offline", (e) => {
  createErrorBox("Offline")
  console.log("offline");
});

window.addEventListener("online", (e) => {
  createErrorBox("Online")
  console.log("online");
});
/**
 * Функция для отправки запроса на авторизацию
 * @returns Токен доступа
 * @param {string} login - Имя пользователя
 * @param {string} password - Пароль
 * @description Если введенного пользователя нет в БД, вернет ошибку
 *
 */
export async function authorization(login, password){
    try{
      let response = await fetch(SERVER_URL + '/login', {
        method:'POST',
        body: JSON.stringify({
            login,
            password,
          }),
        headers: { 'Content-Type': 'application/json' },
       
    })
    let data = await response.json()
    throwErr(response, data);
   
    return data
    }
    catch(err){
      catchErr(err);
    }
}
/**
 * Функция для получения информации о всех счетах
 * @returns Информацию о счётах (Номер, иформация о транзакциях, баланс )
 * @param {string} token - токен доступа
 *
 *
 */
export async function getAccounts(token) {
    try{
      return await fetch('http://localhost:3000/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    }).then((res) => res.json());
    }catch(err){
      catchErr(err);
    }
}
/**
 * Функция для создания счёта
 * @description Создаёт новый счёт, осуществляя запрос POST на сервер
 * @param {string} token - токен доступа
 *
 */
export async function createAccount(token) {
   try{
    return await fetch('http://localhost:3000/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    }).then((res) => res.json());
   }
   catch(err){
    catchErr(err);
   }
}
/**
 * Функция для получения информации конкретном  о счёте
 * @returns Информацию о конкретном счёте (Номер, иформация о транзакциях, баланс )
 * @param {string} token - токен доступа
 * @param {number} id - номер счёта
 * @description Если счёт не найден, выдаст ошибку
 *
 */
export async function getAccount(id, token) {
    try{
      return await fetch(`http://localhost:3000/account/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    }).then((res) => res.json());
    }
    catch(err){
      catchErr(err);
    }
}
/**
 * Функция для создания транзакции
 * @param {string} token - токен доступа
 * @param {number} from - номер счёта отправителя
 * @param {number} to - номер счёта получателя
 * @param {number} amount - количество средств для перевода
 * @description Создаёт новую транзакцию
 *
 */
export async function transferFunds(from, to, amount, token) {
  try{
    return await fetch('http://localhost:3000/transfer-funds', {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
  }catch(err){
    catchErr(err);
  }
}
/**
 * Функция для получения информации о всех доступных валютах для данного счета
 * @param {string} token - токен доступа
 * @description Информацию о всех доступных валютах для данного счета
 *
 */
export async function getCurrencyAccounts(token) {
  try{
    return await fetch('http://localhost:3000/currencies', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  }).then((data) => data.json());
  }catch(err){
    catchErr(err);
  }
}
/**
 * Функция для получения изменения курса валют в реальном времени по протоколу WebSocket
 * @returns Изменение курса валют в реальном времени по протоколу WebSocket
 *
 */
export async function getChangedCurrency() {
  try{
    return new WebSocket('ws://localhost:3000/currency-feed');
  }catch{
    catchErr(err);
  }
}
/**
 * Функция для получения информации о всех доступных валютах
 * @param {string} token - токен доступа
 * @description Информацию о всех доступных валютах
 *
 */
export async function getKnownCurrwncies() {
  try{
    return await fetch('http://localhost:3000/all-currencies').then((data) =>
    data.json()
  );
  }catch(err){
    catchErr(err);
  }
}
/**
 * Функция для получения геопозиции банкоматов
 * @description Геопозицию всех банкоматов
 *
 */
export async function getBanks() {
  try{
    return await fetch('http://localhost:3000/banks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
     
    },
  }).then((res) => res.json());
  }catch(err){
    catchErr(err);
  }
}
/**
 * Функция для обмена валют
 * @param {string} token - токен доступа
 * @param {number} from - валюта для обмена
 * @param {number} to - валюта, на которую меняем
 * @param {number} amount - количество средств для перевода в новую валюту
 * @description Переводит из одной валюты в другую
 *
 */

export async function exchangeCurrency(from, to, amount, token) {
  try{
    return await fetch('http://localhost:3000/currency-buy', {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
  } catch (err) {
  console.error('Error during currency exchange:', err);
  catchErr(err);  // Логирование ошибок
  }

}
/**
 * Функция для преобразования даты в формат "число.месяц.год"
 * @param {Date} data - дата
 * @returns Строку с датой в нужном формате
 *
 */
export function getDate(data) {
  let dat = new Date(data);
  const year = dat.getFullYear();
  let mm = dat.getMonth() + 1;
  let dd = dat.getDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return dd + '.' + mm + '.' + year;
}
createLoader(); 
renderLogInForm();


