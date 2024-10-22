import { getAccount, getDate, transferFunds } from "./index";
import {el, setChildren} from 'redom';
import { createHeader } from './header';
import { createDetails } from "./detailAcc";
import { renderTable } from "./detailAcc";
import { createLoader } from "./loader";
import Chart from 'chart.js/auto';

export async function balanceDetails(id, token){
    document.body.innerHTML ='';
    createLoader();
    const header = createHeader(token);
    let thisAcc = await getAccount(id, token);
    const section = el('section', {class:'section details__section'});
    const container = el('div', {class: 'container login-container'});
    const detailsWrapper = el('div',{class:'details__wrapper'});
    const title = el('h2',{class:'title details__title'}, 'История баланса');
    const returnBtn = el('button', {class:'btn return__btn', id:'ret__btn'}, `Вернуться назад`);
    returnBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        createDetails(id, token);

    })
    setChildren(detailsWrapper, [title, returnBtn]);

    const infoWrapper = el('div', {class:'details__wrapper-info'},[
        el('p', {class:'details__acc-number'}, `№ ${id}`),
        el('p', {class:'details__balance'},'Баланс',[
            el('span', {class:'details__balance-numb'},`${thisAcc.payload.balance} ₽` )
        ])
    ])
    const dynamicChartWrapper = el('div', {class: 'chart__wrapper --balance__chart-wrapper'});
    const dynChart = renderChart(thisAcc.payload.transactions, thisAcc.payload.balance, id);
    const dynChartTitle = el('h2', {class:'title chart__title'}, 'Динамика баланса');
    setChildren(dynamicChartWrapper, [dynChartTitle, dynChart])
    const transactionsChartWrapper = el('div', {class: 'chart__wrapper --balance__chart-wrapper'});
    const trChart = renderChart(thisAcc.payload.transactions, thisAcc.payload.balance, id);
    const trChartTitle = el('h2', {class:'title chart__title'}, 'Соотношение входящих исходящих транзакций');
    setChildren(transactionsChartWrapper, [trChartTitle, trChart])
    const tableWrapper = el('div', {class: 'details__wrapper-table --balance__table'});
    const tableTitle = el('h2', {class:'title table__title '}, 'История переводов');
    const $table = renderTable(thisAcc.payload.transactions, id);
    tableWrapper.append(tableTitle, $table)
    setChildren(container, [detailsWrapper, infoWrapper, dynamicChartWrapper, transactionsChartWrapper ,tableWrapper]);
    setChildren(section, container);
    setChildren(document.body, [header, section]);

}
function renderChart(transactions, balance, id){
    const canvasWrapper = el('div', {class:'canvas__wrapper'});
    canvasWrapper.style.width = '1000px'
    //canvasWrapper.style.height = '288px'
    const chart = el('canvas', {id:'myChart', class: 'chart__canvas'});
    canvasWrapper.append(chart);
    let monthArr = [];
   
    let aprSum = 0;
    let maySum = 0;
    let junSum = 0;
    let julSum = 0;
    let augSum = 0;
    let sepSum = 0; 
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
            case 9:{
                if(transaction.from!=id){
                    sepSum = sepSum + transaction.amount
                   
                }else{
                    sepSum = sepSum - transaction.amount
                    
                }
                break;
            }
            case 8:{
                if(transaction.from!=id){
                    augSum = augSum + transaction.amount
                   
                }else{
                    augSum = augSum - transaction.amount
                    
                }
                break;
            }
            case 7:{
                if(transaction.from!=id){
                    julSum = julSum + transaction.amount
                   
                }else{
                    julSum = julSum - transaction.amount
                    
                }
                break;
            }
            case 6:{
                if(transaction.from!=id){
                    junSum = junSum + transaction.amount
                   
                }else{
                    junSum = junSum - transaction.amount
                    
                }
                break;
            }
            case 5:{
                if(transaction.from!=id){
                    maySum = maySum + transaction.amount
                   
                }else{
                    maySum = maySum - transaction.amount
                    
                }
                break;
            }
            case 4:{
                if(transaction.from!=id){
                    aprSum = aprSum + transaction.amount
                   
                }else{
                    aprSum = aprSum - transaction.amount
                    
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
    sepSum = octSum + sepSum;
    augSum = sepSum + augSum;
    julSum = augSum + julSum;
    junSum = julSum + junSum;
    maySum = junSum + maySum;
    aprSum = maySum + aprSum;
    console.log('mar: ' + marSum,'feb: ' +  febSum,'jen: ' +  jenSum,'dec: ' +  decSum, 'nov: ' + novSum,'oct: ' +  octSum);
    const data = [
        { month: 'апр', count: aprSum },
        { month: 'май', count: maySum },
        { month: 'июнь', count: junSum },
        { month: 'июль', count: julSum },
        { month: 'авг', count: augSum },
        { month: 'сен', count: sepSum },
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