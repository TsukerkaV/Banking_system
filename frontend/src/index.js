import { renderLogInForm } from "./logIn";
import { renderAccount } from "./accounts";
import { createLoader } from "./loader";
const SERVER_URL = 'http://localhost:3000';

function throwErr(res, data){
  if(res.status === 404 || data === null){
    throw new Error("Произошла ошибка, попробуйте обновить страницу позже");
  }
  if(res.status === 500){
    throw new Error("Произошла ошибка, попробуйте обновить страницу позже");
  }
}
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
export async function getChangedCurrency() {
  try{
    return new WebSocket('ws://localhost:3000/currency-feed');
  }catch{
    catchErr(err);
  }
}
export async function getKnownCurrwncies() {
  try{
    return await fetch('http://localhost:3000/all-currencies').then((data) =>
    data.json()
  );
  }catch(err){
    catchErr(err);
  }
}
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
  }catch(err){
    catchErr(err);
  }
}
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


