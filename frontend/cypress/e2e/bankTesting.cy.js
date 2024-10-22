
/// <reference types="cypress" />
import { authorization, getAccounts} from '../../src/index';


describe('Приложение Coin', () => {
    beforeEach(() => {
        cy.visit('http://localhost:1234');
    });

    it('Проверка авторизации', () => {
        cy.get('#login').type('developer');
        cy.get('#pass').type('skillbox');

        cy.intercept('POST', '/login').as('loginRequest');

        cy.get('#form-login-btn').click();

        // Ожидаем успешного запроса на авторизацию
        cy.wait('@loginRequest').then((interception) => {
            const request = interception.request;
            const response = interception.response;

            expect(request.body).to.have.property('login', 'developer');
            expect(request.body).to.have.property('password', 'skillbox');
            expect(response.statusCode).to.equal(200);
        });

        
    });

    it('Проверка возможности просмотра списка счетов', () => {
        cy.get('#login').type('developer');
        cy.get('#pass').type('skillbox');

        cy.intercept('POST', '/login').as('loginRequest');

        cy.get('#form-login-btn').click();

        // Ожидаем успешного запроса на авторизацию
        cy.wait('@loginRequest').then((interception) => {
            const response = interception.response;

            expect(response.statusCode).to.equal(200);

            // Проверяем, что ответ содержит данные
            expect(response.body).to.not.be.null;
            expect(response.body).to.not.be.undefined;

            // Проверяем, что ответ содержит свойство payload
           

            // Выполняем запрос на получение списка счетов с использованием токена
            cy.request({
                method: 'GET',
                url: 'http://localhost:3000/accounts',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Basic ${token}`,
                },
            }).then((accountsResponse) => {
                // Проверяем успешность запроса
                expect(accountsResponse.status).to.equal(200);

                // Проверяем, что ответ содержит данные
                expect(accountsResponse.body).to.not.be.null;
                expect(accountsResponse.body).to.not.be.undefined;

                // Проверяем, что ответ содержит список счетов
                expect(accountsResponse.body).to.have.property('length').and.be.greaterThan(0);

                // Можно также выполнить дополнительные проверки на свойства счетов, если это необходимо
            });
        });
    });
    it('Проверка возможности перевода суммы', () => {});

    it('Проверка создания нового счёта', () => {});
});
