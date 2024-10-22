import {el, setChildren} from 'redom';
import { renderLogInForm } from "./logIn";
import { renderAccount } from './accounts';
import { renderCurrency } from './currency';
import { renderMapOfBanks } from './banks';
//import { createLoader } from './loader';
export function createHeader(token){
    const header = el('header', {class: 'header'}, [])
    const coinLogo = el('a', {class:'coin__logo', href: '#'}, 'Coin.');
    const container = el('div', {class:'container'}, []);
    const headerContainer = el('div', {class:'header__container'},[ ]);
    const headerBtns =  el('div', {class:'header__btns'}, []);
     const banksBtn = el('button', {class: 'btn header__btn bank__btn', id:'banks__btn'}, 'Банкоматы');
     const accBtn =   el('button', {class: 'btn header__btn', id:'accounts__btn'}, 'Счета');
     const valBtn =  el('button', {class: 'btn header__btn', id:'val__btn'}, 'Валюта');
     const exitBtn =  el('button', {class: 'btn header__btn ex__btn', id:'exit__btn'}, 'Выйти');
     banksBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        renderMapOfBanks(token);
     })
     exitBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        renderLogInForm();
     })
     accBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        renderAccount(token);

     })
     valBtn.addEventListener('click', (e)=>{
         e.preventDefault;
         renderCurrency(token);
     })
     
     setChildren(headerBtns, [banksBtn, accBtn, valBtn, exitBtn]);
     setChildren(headerContainer, [coinLogo, headerBtns]);
     setChildren(container, headerContainer)
     setChildren(header, container);
    
    return header;
}
