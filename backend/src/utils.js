const { Pool } = require('pg');

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Bank_system', // Название вашей базы данных
  password: 'postgres',
  port: 5432,
});

// Вспомогательная функция для выполнения SQL-запросов к базе данных
async function queryDB(query, params = []) {
  const client = await pool.connect();
  try {
    const res = await client.query(query, params);
    return res.rows;
  } finally {
    client.release();
  }
}

// Функция для формирования стандартного JSON-ответа
function response(payload = null, error = '') {
  return {
    payload,
    error
  };
}

// Функция форматирования суммы до двух десятичных знаков
function formatAmount(number) {
  return Number(number.toFixed(2));
}

// Функция для генерации случайного ID для аккаунта (только цифры)
function generateAccountId() {
  const randomDigits = () => Math.floor(Math.random() * 10); // Генерация случайной цифры
  let accountId = '';

  // Генерируем строку из 26 случайных цифр
  for (let i = 0; i < 26; i++) {
      accountId += randomDigits();
  }

  return accountId;
}


module.exports = {
  queryDB,
  response,
  formatAmount,
  generateAccountId
};
