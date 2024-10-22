import { getAccount, getDate, transferFunds } from "./index";
import { createHeader } from "./header";
import {el, setChildren} from 'redom';
import { renderAccount } from "./accounts";
import { balanceDetails } from "./balanceDetails";
import { createLoader } from "./loader";
import JustValidate from 'just-validate';
import Chart from 'chart.js/auto';

export async function createDetails(id, token){
    let data = localStorage.getItem('numbsList');
    let numbsList = [];
    if(data !=="" && data !== null){
        numbsList = JSON.parse(data);
    }
    document.body.innerHTML ='';
    createLoader();
    
    const header = createHeader(token);
    let thisAcc = await getAccount(id, token);
    const section = el('section', {class:'section details__section'});
    const container = el('div', {class: 'container login-container'});
    const detailsWrapper = el('div',{class:'details__wrapper'});
    const title = el('h2',{class:'title details__title'}, 'Просмотр счёта');
    const returnBtn = el('button', {class:'btn return__btn', id:'ret__btn'}, `Вернуться назад`);
    setChildren(detailsWrapper, [title, returnBtn]);

    const infoWrapper = el('div', {class:'details__wrapper-info'},[
        el('p', {class:'details__acc-number'}, `№ ${id}`),
        el('p', {class:'details__balance'},'Баланс',[
            el('span', {class:'details__balance-numb'},`${thisAcc.payload.balance} ₽` )
        ])
    ])
    const statWrapper = el('div', {class:'details__stat-wrapper'});
    const detailForm = el('form', {class:'details__form', id:'details__form'});
    const formTitle = el('h2', {class: 'form__title form__title-details'}, "Новый перевод");
    const firstFormGrp =  el('div', {class: 'input__group inp__group-details'});
    const numbLabel = el('label',{class: 'input__label label-details'}, 'Номер счёта получателя');
    const numbInput =  el('input', {class: 'form__input', type:'text', id:'number__input', required:true});
    const inputWrapper1 = el('div', {class: 'input__wrapper'});
    setChildren(inputWrapper1, numbInput);
    const inner =  el('div', {class: 'inner__wrapper', id:'inner'});
    setChildren(inner, inputWrapper1);
    setChildren(firstFormGrp,[numbLabel,inner]);
    const secondFormGrp =  el('div', {class: 'input__group inp__group-details'});
    const sumLabel = el('label',{class: 'input__label label-details'}, 'Сумма перевода');
    const sumInput = el('input', {class: 'form__input', type:'text', id:'sum__input', required:true});
    const inputWrapper2 = el('div', {class: 'input__wrapper'});
    setChildren(inputWrapper2, sumInput)
    const sumErr = el('div', {class: 'error__wrapper', id:'err__sum'});
    setChildren(secondFormGrp, [sumLabel,inputWrapper2,sumErr]);
    const formBtnDiv = el('div', {class:'form__wrapper'})
    const formBtn = el('button', {class: 'btn form-btn form-send-btn', id:'form-send-btn'}, 'Отправить');

    
    
    setChildren(formBtnDiv, formBtn);
    setChildren(detailForm, [formTitle, firstFormGrp, secondFormGrp,formBtnDiv]);

    const chart = renderChart(thisAcc.payload.transactions, thisAcc.payload.balance, id);
    const chartWrapper = el('div', {class: 'chart__wrapper'});
    chart.addEventListener('click', (e)=>{
        e.preventDefault();
        balanceDetails(id, token);
    })
    const chartTitle = el('h2', {class:'title chart__title'}, 'Динамика баланса');
    setChildren(chartWrapper, [chartTitle, chart]);

    setChildren(statWrapper, [detailForm, chartWrapper]);
    const tableWrapper = el('div', {class: 'details__wrapper-table'});
    const tableTitle = el('h2', {class:'title table__title '}, 'История переводов');
    const $table = renderTable(thisAcc.payload.transactions, id);
    tableWrapper.append(tableTitle, $table)
    tableWrapper.addEventListener('click', (e)=>{
        e.preventDefault();
        balanceDetails(id, token);
        
    })
    
    setChildren(container, [detailsWrapper, infoWrapper, statWrapper, tableWrapper]);
    setChildren(section, container);
    setChildren(document.body, [header, section]);
    returnBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        renderAccount(token);

    })
    const validation = new JustValidate(detailForm);
    validation
    .addField('#number__input', [
        {
            rule: 'minLength',
            value: 1,
            errorMessage: 'Введите номер счёта'
        },
        {
            validator: (value) => {
              if(value > 0){
                numbInput.classList.remove('error')
                return value;
              }else{
                numbInput.classList.add('error')
                
              }
              
            },
            errorMessage: 'Введите номер счёта',
        },
    ])
    .addField('#sum__input', [
        {
            rule: 'minLength',
            value: 1,
            errorMessage: 'Введите сумму',
            errorsContainer: sumErr,
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
            errorsContainer: sumErr,
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
            errorsContainer: sumErr,
            errorMessage: 'Введите положительную сумму',
        },
    ])
    autocomplite(numbsList, inner, numbInput);

    detailForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        
        let newTransactions = await transferFunds(id, numbInput.value, sumInput.value, token);
        const newTable = renderTable(newTransactions.payload.transactions, id);
        tableWrapper.innerHTML = '';
        setChildren(tableWrapper, [tableTitle, newTable]);
        console.log(newTransactions.payload.transactions.at(-1));
    })

}

function autocomplite(numbsList, inner, input){
    
    const $findList = document.createElement('ul');
    $findList.classList.add('find-list', 'hide');
    inner.append($findList);

    numbsList.forEach(numb =>{
        const findItem = document.createElement('li');
        const findNumb =  document.createElement('p');

        findItem.classList.add('find-item');
        findNumb.classList.add('find-link');

        findNumb.textContent = numb;
        findItem.append(findNumb);
        $findList.append(findItem);
    });
    const insertMark =(str, pos, len) =>str
        .slice(0,pos) + '<mark class = "mark" >' + str
        .slice(pos, pos + len) + '</mark>' + str
        .slice(pos + len);

    input.addEventListener('input', (e)=>{
        e.preventDefault();
        const value = input.value.trim();
        if(!isNaN(value)&&value.length>15){
            if (!numbsList.includes(value)) {
                numbsList.push(value); 
            }
    
        }
        localStorage.setItem('numbsList', JSON.stringify(numbsList));
        
        const foundItems = document.querySelectorAll('.find-link');
        
    
    if(value!=''){
        foundItems.forEach(link =>{
            if(link.textContent.search(value) ==-1){
              link.classList.add('hide');
              link.innerHTML = link.textContent;
            } else{
              link.classList.remove('hide');
              $findList.classList.remove('hide');
              const str = link.textContent;
              link.innerHTML = insertMark(str, link.textContent.search(value), value.length);
              link.addEventListener('click', ()=>{
                input.innerHTML = link.textContent;
              })
            }
        })
    }else{
        foundItems.forEach(link =>{
            link.classList.remove('hide');
            $findList.classList.add('hide');
            link.innerHTML = link.textContent;
        });
    }
    inner.addEventListener('click', event =>{
        event._isClickWithInModal = true;
    })
    window.addEventListener('click', event =>{
        if (event._isClickWithInModal) return;
        $findList.classList.add('hide');
    })
    
    
    })
  
}

export function renderTable(transactions, id){
    const table = el('table', {class:'table details__table', id:'details__table'});
    const tHead = el('thead', {class: 'thead details__thead'}, [
        el('tr', {class: 'thead__tr'}, [
            el('th', {class:'thead__th'}, 'Счёт отправителя'),
            el('th', {class:'thead__th'}, 'Счёт получателя'),
            el('th', {class:'thead__th'}, 'Сумма'),
            el('th', {class:'thead__th'}, 'Дата')
        ])
    ])
    const tBody = el('tbody', {class:'tbody details__tbody', id:'details__tbody'});
    let count = 0;
    for(const transaction of transactions.slice(-10)){
        count ++;
       
            const $tr = el('tr', {class:'tbody__tr'});
            const sendTd = el('td', {class:'table__td'}, transaction.from);
            const recTd = el('td', {class:'table__td'}, transaction.to);
            const sumTd = el('td', {class:'table__td --sum-td'} );
            if(transaction.from!=id){
                sumTd.textContent = `+ ${transaction.amount} ₽`
                sumTd.classList.add('green');
            }else if(transaction.from === id){
                sumTd.textContent = `- ${transaction.amount} ₽`;
                sumTd.classList.add('red');
            }
            const dateTd = el('td', {class:'table__td --date-td'}, getDate(transaction.date));
            $tr.append(sendTd,recTd,sumTd,dateTd);
            tBody.append($tr);
        
       

    }
    setChildren(table, [tHead, tBody]);
    return table;
}
function renderChart(transactions, balance, id){
    const canvasWrapper = el('div', {class:'canvas__wrapper'});
    canvasWrapper.style.width = '500px'
    const chart = el('canvas', {id:'myChart'});
    canvasWrapper.append(chart);
    let monthArr = [];
    let octSum = 0;
    let novSum = 0;
    let decSum = 0;
    let jenSum = 0;
    let febSum = 0;
    let marSum = balance;
    for(const transaction of transactions){
        let dat = new Date(transaction.date);
        let mm = dat.getMonth()+1;
        // let now = new Date();
        // let nowMonth = now.getMonth()+1
        monthArr.push(mm);
        switch(mm){
            case 2:{
                if(transaction.from!=id){
                    febSum = febSum + transaction.amount
                   
                }else{
                    febSum = febSum - transaction.amount
                    
                }
                break;
            }
            case 3:{
                if(transaction.from!=id){
                    febSum = febSum - transaction.amount
                   
                }else{
                    febSum = febSum + transaction.amount
                    
                }
                break;
            }
            case 1:{
                if(transaction.from!=id){
                    jenSum = jenSum + transaction.amount
                   
                }else{
                    jenSum = jenSum - transaction.amount
                    
                }
                break;
            }
            case 12:{
                if(transaction.from!=id){
                    decSum = decSum + transaction.amount
                   
                }else{
                    decSum = decSum - transaction.amount
                    
                }
                break;
            }
            case 11:{
                if(transaction.from!=id){
                    novSum = novSum + transaction.amount
                   
                }else{
                    novSum = novSum - transaction.amount
                    
                }
                break;
            }
            case 10:{
                if(transaction.from!=id){
                    octSum = octSum + transaction.amount
                   
                }else{
                    octSum = octSum - transaction.amount
                    
                }
                break;
            }
        }
        
        
    }
    console.log('mar: ' + marSum,'feb: ' +  febSum,'jen: ' +  jenSum,'dec: ' +  decSum, 'nov: ' + novSum,'oct: ' +  octSum);
    febSum = marSum + febSum;
    jenSum = febSum + jenSum;
    decSum = jenSum + decSum;
    novSum = decSum + novSum;
    octSum = novSum + octSum;
    console.log('mar: ' + marSum,'feb: ' +  febSum,'jen: ' +  jenSum,'dec: ' +  decSum, 'nov: ' + novSum,'oct: ' +  octSum);
    const data = [
        { month: 'окт', count: octSum },
        { month: 'ноя', count: novSum },
        { month: 'дек', count: decSum },
        { month: 'янв', count: jenSum },
        { month: 'фев', count: febSum },
        { month: 'мар', count: marSum },
        
    ];
    
      new Chart(
        chart,
        {
          type: 'bar',
          data: {
            labels: data.map(row => row.month),
            datasets: [
              {
                label:'',
                data: data.map(row => row.count),
                backgroundColor:'rgba(17, 106, 204, 1)',
                
              }
            ],
            
          },
          
          options:{
            scales:{
                x: {
                    grid:{
                        display: false,
                    },
                    borderWidth: 1
                },
                y: {
                    position:'right',
                    grid:{
                        display: false,
                    },
                    ticks:{
                        callback: function (value, index, values) {
                            
                            return index === 0 || index === values.length - 1 ? value : '';
                        }
                    },
                    borderWidth: 1
                },
            },
            plugins:{
                legend:{
                    display:false,
                }
            }
          }
        }
      );
     
    return canvasWrapper;
}