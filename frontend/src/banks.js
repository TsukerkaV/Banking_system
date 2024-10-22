import {el, setChildren} from 'redom';
import { createHeader } from "./header";
import { getBanks } from ".";
import { createLoader } from "./loader";

export async function renderMapOfBanks(token){
    document.body.innerHTML ='';
    createLoader();
    const header = createHeader(token);
    header.style.marginBottom = '50px'
    const container = el('div', {class: 'container login-container'});
    const section = el('section', {class: 'section banks__section'});
    const title = el('h2', {class: 'title banks__title'}, 'Карта банкоматов');
    const mapWrapper = el('div', {class: 'map__wrapper'});
    const $map = el('div', {class: 'banks__map', id:'map'});
    $map.style.width = '100%';
    $map.style.height = '728px';
    let banks = await getBanks();
    var myMap;
    ymaps.ready(init);
    
    function init () {
        myMap = new ymaps.Map('map', {
            center:[55.76, 37.64], // Москва
            zoom:10
        });
        for(const bank of banks.payload){
            let placemark = new ymaps.Placemark([bank.lat, bank.lon],{},{});
            myMap.geoObjects.add(placemark);
        }
       
    
    
    }
    setChildren(mapWrapper, $map);
    setChildren(container, [title, mapWrapper]);
    setChildren(section, container)
    setChildren(document.body, [header, section])

}