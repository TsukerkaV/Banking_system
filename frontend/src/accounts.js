import { getAccounts, createAccount, getAccount } from "./index";
import { createHeader } from "./header";
import { el, setChildren } from 'redom';
import { createDetails } from "./detailAcc";
import { createLoader } from "./loader";
import { getDate } from "./index";

export async function renderAccount(token) {

    let sortFlag = ''
    const accounts = await getAccounts(token);
    accounts.payload = accounts.payload.sort(function (a, b) {
        if (a[sortFlag] < b[sortFlag]) return -1;

    })
    console.log(accounts.payload);

    async function createAcc(accounts, token) {

        document.body.innerHTML = '';
        createLoader();

        const header = createHeader(token);
        const accSection = el('section', { class: 'section section-acc' });
        const container = el('div', { class: 'container login-container' });
        const acoountsWrapper = el('div', { class: 'accounts__wrapper' }, []);
        const accTitle = el('h2', { class: 'accounst__title' }, 'Ваши счета');
        const createBtn = el('button', { class: 'btn account__create', id: 'create__account' }, "+ Создать новый счёт");
        const group = el('div', { class: 'accounst__group' }, []);




        setChildren(group, [accTitle]);


        setChildren(acoountsWrapper, [group, createBtn]);
        const $accountsList = el('ul', { class: 'accounts__list list-reset' });
        for (const account of accounts) {
            const thisAcc = await getAccount(account.account, token);
            const accountCard = el('div', { class: 'account__card' });
            const cardRight = el('div', { class: 'account__card-right' });
            const cardTitle = el('h3', { class: 'card__title' }, account.account);
            const cardBalance = el('p', { class: 'account__balance' }, `${account.balance} ₽`);
            const cardTransaction = el('p', { class: 'account__transaction' }, `Последняя транзакция: `);
            const trDate = el('span', { class: 'account__transaction-date' });
            if (account.transactions.length > 0 && account.transactions.at(-1).date !== null) {
                console.log(account.transactions.at(-1).date);
                trDate.innerHTML = getDate(account.transactions.at(-1).date);
            } else {
                trDate.innerHTML = getDate(new Date());
            }
            cardTransaction.append(trDate);
            
            setChildren(cardRight, [cardTitle, cardBalance, cardTransaction]);

            const btnWraper = el('div', { class: 'card__wrapper-btn' })
            const openBtn = el('button', { class: 'btn account__open-lnk' }, 'Открыть');

            openBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                console.log(thisAcc);
                createDetails(account.account, token);

            });

            setChildren(btnWraper, openBtn);
            setChildren(accountCard, [cardRight, btnWraper]);
            $accountsList.append(accountCard);

        }
        const wrapper = el('div', { class: 'list__wrapper' });
        setChildren(wrapper, $accountsList);
        setChildren(container, [acoountsWrapper, wrapper]);
        setChildren(accSection, container);
        setChildren(document.body, [header, accSection]);

        document.getElementById('create__account').addEventListener('click', async (e) => {
            e.preventDefault();
            let res = await createAccount(token);
            $accountsList.append(res);
            console.log(res);
            renderAccount(token);
        })


    }
    createAcc(accounts.payload, token);
    document.querySelector('.current').innerHTML = 'Сортировка';
}