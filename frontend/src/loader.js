import {el} from 'redom';
import { loaderSvg } from './svg';

/**
 * Функция для создания загрузчика
 * @returns Loader
 */
export function createLoader(){
    const mask = el('div', {class: 'mask'});
    const loader = el('div', {class: 'loader'});
    loader.innerHTML = loaderSvg;
    mask.append(loader);
    document.body.append(mask);
    window.addEventListener('load',()=>{
        mask.classList.add('hide');
    })
    
   
};