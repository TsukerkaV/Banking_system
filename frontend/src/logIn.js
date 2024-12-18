import {el, setChildren} from 'redom';
import { authorization} from './index';
import { createLoader } from './loader';
import { renderAccount } from './accounts';
import JustValidate from 'just-validate';
/**
 * Функция для создания формы для входа в аккаунт
 *
 */

export function renderLogInForm() {
    document.body.innerHTML = '';
    createLoader();
    const header = el('header', { class: 'header' }, [
        el('div', { class: 'container ' }, [
            el('a', { class: 'coin__logo --coin__logo-login', href: '#' }, 'Coin.')
        ])
    ])
    const $form = el('form', { class: 'form form-logIn' }, [
        el('h2', { class: 'form__title', id: 'login-form' }, "Вход в аккаунт"),
        el('div', { class: 'input__group' }, [
            el('label', { class: 'input__label' }, 'Логин'),
            el('div', { class: 'input__wrapper' }, [
                el('input', { class: 'form__input', type: 'text', id: 'login', required: true })
            ]),
        ]),
        el('div', { class: 'input__group' }, [
            el('label', { class: 'input__label' }, 'Пароль'),
            el('div', { class: 'input__wrapper' }, [
                el('input', { class: 'form__input', type: 'password', id: 'pass', required: true }),
            ]),
            el('div', { class: 'error__wrapper', id: 'err__pass' })
        ]),
        el('button', { class: 'btn form-btn', id: 'form-login-btn', type: 'submit' }, 'Войти'),
        el('div', { class: 'error__wrapper', id: 'err__login' }) // для отображения ошибки
    ])

    const container = el('div', { class: 'container login-container', id: 'login-container' });
    const formContainer = el('div', { class: 'form-container', id: 'form-container' });
    setChildren(formContainer, $form);
    setChildren(container, formContainer);
    setChildren(document.body, [header, container]);

    const validation = new JustValidate($form);

    validation
        .addField('#login', [
            {
                rule: 'minLength',
                value: 6,
                errorMessage: 'Логин меньше 6 символов'
            },
            {
                validator: (value) => {
                    if (!value.includes(' ')) {
                        document.getElementById('login').classList.remove('error')
                        return value;
                    } else {
                        document.getElementById('login').classList.add('error')
                    }
                },
                errorMessage: 'В логине содержатся пробелы',
            },
            {
                rule: 'maxLength',
                value: 30,
            },
        ])
        .addField('#pass', [
            {
                rule: 'minLength',
                value: 6,
                errorMessage: 'Пароль меньше 6 символов'
            },
            {
                validator: (value) => {
                    if (!value.includes(' ')) {
                        document.getElementById('pass').classList.remove('error')
                        return value;
                    } else {
                        document.getElementById('pass').classList.add('error')
                    }
                },
                errorMessage: 'В пароле содержатся пробелы',
            },
            {
                rule: 'maxLength',
                value: 30,
            },
        ])

    $form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Останавливает стандартную отправку формы

        const isValid = validation.isValid;  // Проверка, прошла ли форма валидацию

        if (isValid) {
            const $loginInput = document.getElementById('login');
            const $passInput = document.getElementById('pass');
            const token = await authorization($loginInput.value.trim(), $passInput.value.trim());

            if (token.success) {
                // Если токен получен, отображаем аккаунт
                renderAccount(token.token);
            } else {
                // Если ошибка, показываем сообщение об ошибке
                document.getElementById('err__login').textContent = "Неверный логин или пароль";
            }
        } else {
            // Если форма не прошла валидацию, ошибки будут показаны на форме
            console.log('Форма не прошла валидацию');
        }
    });
}
