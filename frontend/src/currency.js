import { getCurrencyAccounts, getChangedCurrency, getKnownCurrwncies,exchangeCurrency } from "./index";
import { createHeader } from "./header";
import {el, setChildren} from 'redom';
import { greenArr, redArr } from "./svg";
import { createLoader } from "./loader";
import JustValidate from 'just-validate';

export async function renderCurrency(token){
    document.body.innerHTML ='';
    createLoader();
    const header = createHeader(token);
    const section = el('section', {class:'section currency__section'});
    const container = el('div', {class: 'container '});
    const title = el('h2', {class:'title curr__title'}, 'Валютный обмен');
    const sectiionWrap = el('div', {class:'curr__wrapper'});
    const leftWrap = el('div', {class:'curr__wrapper-left'});
    const rightWrap = el('div', {class:'curr__wrapper-right'});

    const changeCoins = []
    
    console.log(changeCoins);
    const $currencyAcc = await getCurrencyAccounts(token);
    
    console.log($currencyAcc.payload);
    const knownCurr = await getKnownCurrwncies();
    console.log(knownCurr.payload);
    const arr = [];
    
    
    
    const coinCard = renderCoinTable($currencyAcc.payload, knownCurr.payload);
    const $form = await createForm(token, knownCurr.payload) ;
    setChildren(leftWrap, [coinCard, $form]);
    const changeCard = await createChangedCoinCard();
    setChildren(rightWrap, changeCard);
   
    setChildren(sectiionWrap,[leftWrap, rightWrap]);
    setChildren(container,[title, sectiionWrap])
    setChildren(section, container);
    setChildren(document.body, [header, section]);
}

function renderCoinTable(coins){
    const coinCard = el('div', {class: "coin__card"});
    coinCard.innerHTML = '';
    const cardTitle = el('h3', {class:'coin__card-title'}, 'Ваши валюты');
   

    const coinUl = el('ul', {class:'list-reset coin__ul'},[
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.AUD.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.AUD.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.BTC.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.BTC.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.BYR.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.BYR.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.CAD.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.CAD.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.CHF.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.CHF.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.CNH.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.CNH.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.ETH.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.ETH.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.EUR.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.EUR.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.GBP.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.GBP.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.HKD.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.HKD.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.JPY.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.JPY.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.NZD.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.NZD.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.RUB.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.RUB.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.UAH.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.UAH.amount)
        ]),
        el('li', {class: 'coin__item'},[
            el('p', {class:'coin__currency'}, coins.USD.code),
            el('span',{class:'coin__item-border'}),
            el('span', {class:'coin__amount'}, coins.USD.amount)
        ])

    ]);
    
    setChildren(coinCard, [cardTitle, coinUl]);

    return coinCard;
}
async function createChangedCoinCard(){
    const chCurr = await getChangedCurrency();
    const card = el('div', {class: 'change__card'});
    const title = el('h3', {class: 'change__title'}, 'Изменение курсов в реальном времени');
    const ul = el('ul', {class:'list-reset change__ul'});
    let coinsArr = [];
   
    chCurr.onmessage = (event) =>{
        const coin = JSON.parse(event.data)
        coinsArr.push(coin);
   
        // let cnt = 0;
        for(const i of coinsArr){
            //cnt++;
            if(ul.childNodes.length <22){
                // console.log("i "+ i.to);
                const li = el('li', {class: 'change__item'})
                const coinPare = el('p', {class:'coin__currency'}, `${i.from}/${i.to}`);
                const coinBorder = el('span',{class:'coin__item-border'});
                const coinRate = el('span', {class:'coin__amount --ch_card-amount'}, `${i.rate}`);
                const coinSvg = el('span', {class:'coin__svg'});
                if(i.change <0){
                    coinBorder.classList.add('red__border');
                    coinSvg.innerHTML = redArr;
                }else{
                    coinBorder.classList.add('green__border');
                    coinSvg.innerHTML = greenArr;
                }
               
                coinRate.append(coinSvg);
                setChildren(li, [coinPare, coinBorder, coinRate])
                ul.append(li);
            }
            else{
                // ul.removeChild(ul.childNodes[0]); 
                // const li = el('li', {class: 'change__item'})
                // const coinPare = el('p', {class:'coin__currency'}, `${i.from}/${i.to}`);
                // const coinBorder = el('span',{class:'coin__item-border'});
                // const coinRate = el('span', {class:'coin__amount --ch_card-amount'}, `${i.rate}`);
                // const coinSvg = el('span', {class:'coin__svg'});
                // if(i.change <0){
                //     coinBorder.classList.add('red__border');
                //     coinSvg.innerHTML = redArr;
                // }else{
                //     coinBorder.classList.add('green__border');
                //     coinSvg.innerHTML = greenArr;
                // }
               
                // coinRate.append(coinSvg);
                // setChildren(li, [coinPare, coinBorder, coinRate])
                // ul.append(li);

                break;
            } 
            
        }
    }
       
        setChildren(card, [title, ul])
        
        
    
    return card;

}
async function createForm(token, knownCurr){
    const form = el('form', {class: 'coin__form'});
    const frmTitle = el('h3', {class: 'coin__formtitle'}, 'Обмен валют');
    const selectWrapper = el('div' ,{class: 'coin__select-wraper'});
    const formWrapper = el('div' ,{class: 'coin__form-wraper'});
    const btnWrapper = el('div' ,{class: 'coin__btn-wraper'});
    const selectGroup1 = el('div', {class: 'coin__select-group'});
    const selectGroup2 = el('div', {class: 'coin__select-group'});
    const selectLabelFrom = el('label', {class: 'coin__select-label'}, 'Из');
    const selectFrom = el('select', {class: 'coin__select'});
    const selectLabelTo = el('label', {class: 'coin__select-label'}, 'В');
    const selectTo = el('select', {class: 'coin__select'});
    for(let i = 0; i<knownCurr.length; i++){
        selectFrom.append(new Option(`${knownCurr[i]}`,`${knownCurr[i]}` ));
        selectTo.append(new Option(`${knownCurr[i]}`,`${knownCurr[i]}` ));
    }
    
    const inputGroup = el('div', {class:'coin__input-group'});
    const inputLabel = el('label', {class: 'coin__input-label coin__select-label'}, 'Сумма')
    
    const inputWrapper = el('div', {class: 'input__wrapper'});
    const sumInput = el('input', {class:'coin__sum-input'});
    setChildren(inputWrapper, sumInput);
    const formBtn = el('button', {class: 'btn coin__form-btn'}, 'Обменять');
    const validation = new JustValidate(form);
    validation
    .addField(sumInput, [
        {
            rule: 'minLength',
            value: 1,
            errorMessage: 'Введите сумму',
           
        },
        {
            validator: (value) => {
                if(value > 0){
                    sumInput.classList.remove('error')
                    return value;
                  }else{
                    sumInput.classList.add('error')
                    
                  }
            },
            
            errorMessage: 'Введите сумму',
        },
        {
            validator: (value) => {
              if(!value.includes('-')){
                sumInput.classList.remove('error')
                return value;
              }else{
                sumInput.classList.add('error')
                
              }
              
            },
            
            errorMessage: 'Введите положительную сумму',
        },

    ])


    form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const res = await exchangeCurrency(selectFrom.value, selectTo.value, sumInput.value, token);
        renderCoinTable(res.payload);
        renderCurrency(token)
        console.log(res.payload);
    })
    setChildren(inputGroup, [inputLabel, inputWrapper]);
    setChildren(selectGroup1 ,[selectLabelFrom, selectFrom]);
    setChildren(selectGroup2 ,[selectLabelTo, selectTo]);
    setChildren(selectWrapper, [selectGroup1, selectGroup2]);
    setChildren(formWrapper, [selectWrapper, inputGroup]);
    setChildren(btnWrapper ,[formWrapper, formBtn]);
    setChildren(form, [frmTitle, btnWrapper]);

    return form



}