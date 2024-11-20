/**
 * @module DatabaseUtils
 * @description Модуль для взаимодействия с базой данных PostgreSQL, обработки данных и формирования JSON-ответов.
 */

const { Pool } = require('pg');

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Bank_system', // Название вашей базы данных
  password: 'postgres',
  port: 5432,
});

/**
 * Выполняет SQL-запрос к базе данных PostgreSQL.
 * 
 * @async
 * @function queryDB
 * @param {string} query - SQL-запрос, который нужно выполнить.
 * @param {Array} [params=[]] - Параметры для подстановки в SQL-запрос.
 * @returns {Promise<Array<Object>>} Результат выполнения SQL-запроса в виде массива объектов.
 * @throws {Error} Может выбросить ошибку, если выполнение запроса завершилось неудачно.
 * 
 * @example
 * const result = await queryDB('SELECT * FROM accounts WHERE id = $1', [1]);
 * console.log(result);
 */
async function queryDB(query, params = []) {
  const client = await pool.connect();
  try {
    const res = await client.query(query, params);
    return res.rows;
  } finally {
    client.release();
  }
}

/**
 * Формирует стандартный JSON-ответ для API.
 * 
 * @function response
 * @param {*} [payload=null] - Данные, которые нужно вернуть в ответе.
 * @param {string} [error=''] - Сообщение об ошибке, если она произошла.
 * @returns {Object} Структурированный JSON-ответ с данными и сообщением об ошибке.
 * 
 * @example
 * const successResponse = response({ id: 1, balance: 100.00 });
 * console.log(successResponse); 
 * // { payload: { id: 1, balance: 100.00 }, error: '' }
 * 
 * const errorResponse = response(null, 'Ошибка базы данных');
 * console.log(errorResponse); 
 * // { payload: null, error: 'Ошибка базы данных' }
 */
function response(payload = null, error = '') {
  return {
    payload,
    error
  };
}

/**
 * Форматирует число до двух десятичных знаков.
 * 
 * @function formatAmount
 * @param {number} number - Число, которое нужно отформатировать.
 * @returns {number} Число, округленное до двух знаков после запятой.
 * 
 * @example
 * const formatted = formatAmount(123.456);
 * console.log(formatted); // 123.46
 */
function formatAmount(number) {
  return Number(number.toFixed(2));
}

/**
 * Генерирует случайный ID для аккаунта, состоящий из 26 цифр.
 * 
 * @function generateAccountId
 * @returns {string} Строка из 26 случайных цифр.
 * 
 * @example
 * const accountId = generateAccountId();
 * console.log(accountId); // Например: "12345678901234567890123456"
 */
function generateAccountId() {
  const randomDigits = () => Math.floor(Math.random() * 10); // Генерация случайной цифры
  let accountId = '';

  // Генерируем строку из 26 случайных цифр
  for (let i = 0; i < 26; i++) {
      accountId += randomDigits();
  }

  return accountId;
}

// Экспортируем функции для использования в других модулях
module.exports = {
  queryDB,
  response,
  formatAmount,
  generateAccountId
};
