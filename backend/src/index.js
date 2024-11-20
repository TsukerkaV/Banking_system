const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { formatAmount, generateAccountId, response } = require('./utils.js'); // Подключение утилит

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Bank_system', // Название вашей базы данных
  password: 'postgres',
  port: 5432,
});

const app = express();
const expressWs = require('express-ws')(app);
const port = 3000;

const AUTH_DATA = Object.freeze({
  login: 'developer',
  password: 'password',
  token: 'ZGV2ZWxvcGVyOnNraWxsYm94'
});

const MINE_ACCOUNT = '74213041477477406320783754';
const KNOWN_CURRENCY_CODES = Object.freeze([
  'ETH', 'BTC', 'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNH', 'HKD', 'NZD', 'RUB', 'UAH', 'BYR'
]);

let currencyFeedSubscribers = [];

// Вспомогательная функция для выполнения запросов к базе данных
async function queryDB(query, params = []) {
  const client = await pool.connect();
  try {
    const res = await client.query(query, params);
    return res.rows;
  } finally {
    client.release();
  }
}

// Middleware для проверки авторизации
function authCheck(req, res, next) {
  if (req.headers.authorization !== `Basic ${AUTH_DATA.token}`) {
    res.json({ success: false, error: 'Unauthorized' });
    return;
  }
  next();
}

// Настройка CORS и JSON парсера
app.use(cors());
app.use(bodyParser.json());

// Маршрут проверки работы сервера
app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Эндпоинт для авторизации
app.post('/login', (req, res) => {
  const { login, password } = req.body || {};

  if (login === AUTH_DATA.login && password === AUTH_DATA.password) {
    res.json({ success: true, token: AUTH_DATA.token });
  } else {
    res.json({ success: false, error: 'Invalid login or password' });
  }
});

// Эндпоинт для получения аккаунтов
app.get('/accounts', authCheck, async (req, res) => {
  try {
    const myAccounts = await queryDB("SELECT * FROM accounts WHERE mine = true");
    res.json({ success: true, data: myAccounts });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Эндпоинт для получения конкретного аккаунта по ID
app.get('/account/:id', authCheck, async (req, res) => {
  const { id } = req.params;
  try {
    // Получаем информацию о счете
    const account = await queryDB("SELECT * FROM accounts WHERE account_id = $1", [id]);
    
    // Проверка, существует ли аккаунт
    if (account.length === 0) {
      return res.json({ success: false, error: 'No such account' });
    }

    // Получаем все транзакции для указанного аккаунта
    const transactions = await queryDB(
      "SELECT * FROM transactions WHERE from_account = $1 OR to_account = $1 ORDER BY date",
      [id]
    );

    // Формируем ответ в нужном формате
    const responseData = {
      account_id: account[0].account_id,
      balance: account[0].balance,
      mine: account[0].mine,
      transactions: transactions.map(tx => ({
        date: tx.date,
        from: tx.from_account,
        to: tx.to_account,
        amount: tx.amount
      }))
    };

    res.json({ success: true, data: responseData });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});


// Эндпоинт для создания нового аккаунта
app.post('/create-account', authCheck, async (req, res) => {
  const newAccountId = generateAccountId();
  try {
    await queryDB("INSERT INTO accounts (account_id, balance, mine) VALUES ($1, $2, $3)", [newAccountId, 0, true]);
    res.json({ success: true, data: { account_id: newAccountId, balance: 0, mine: true } });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Эндпоинт для перевода средств между аккаунтами
app.post('/transfer-funds', authCheck, async (req, res) => {
  const { from, to, amount: rawAmount } = req.body;
  const amount = Number(rawAmount);

  try {
    const fromAccount = await queryDB("SELECT * FROM accounts WHERE account_id = $1 AND mine = true", [from]);
    const toAccount = await queryDB("SELECT * FROM accounts WHERE account_id = $1", [to]);

    if (fromAccount.length === 0) {
      return res.json({ success: false, error: 'Invalid account from' });
    }

    if (toAccount.length === 0) {
      return res.json({ success: false, error: 'Invalid account to' });
    }

    if (fromAccount[0].balance < amount) {
      return res.json({ success: false, error: 'Overdraft prevented' });
    }

    await queryDB("BEGIN");

    await queryDB("UPDATE accounts SET balance = balance - $1 WHERE account_id = $2", [amount, from]);
    await queryDB("UPDATE accounts SET balance = balance + $1 WHERE account_id = $2", [amount, to]);
    await queryDB(
      "INSERT INTO transactions (date, from_account, to_account, amount) VALUES ($1, $2, $3, $4)",
      [new Date().toISOString(), from, to, amount]
    );

    await queryDB("COMMIT");

    res.json({ success: true });
  } catch (error) {
    await queryDB("ROLLBACK");
    res.json({ success: false, error: error.message });
  }
});

// Эндпоинт для получения всех известных валют
app.get('/all-currencies', (req, res) => {
  res.json({ success: true, data: KNOWN_CURRENCY_CODES });
});

// Эндпоинт для WebSocket подписки на обновления валютных курсов
app.ws('/currency-feed', (ws, req) => {
  currencyFeedSubscribers.push(ws);

  // Устанавливаем интервал для отправки актуальных данных из базы данных
  const sendCurrencyUpdates = setInterval(async () => {
    try {
      // Извлекаем все данные из таблицы exchange_rates
      const exchangeRates = await queryDB("SELECT currency_pair, rate FROM exchange_rates");

      // Преобразуем данные в нужный формат для клиента
      exchangeRates.forEach(rateData => {
        const [from, to] = rateData.currency_pair.split('/');
        const dataToSend = {
          from,
          to,
          rate: rateData.rate,
          change: Math.random() > 0.5 ? 1 : -1  // Примерное изменение курса для демонстрации
        };

        // Отправляем данные всем подписчикам
        currencyFeedSubscribers.forEach(subscriber => {
          if (subscriber.readyState === ws.OPEN) {
            subscriber.send(JSON.stringify(dataToSend));
          }
        });
      });
    } catch (error) {
      console.error("Ошибка при получении курсов валют из базы данных:", error);
    }
  }, 2000); // Обновляем данные каждые 2 секунды

  ws.on('close', () => {
    clearInterval(sendCurrencyUpdates);
    currencyFeedSubscribers = currencyFeedSubscribers.filter(subscriber => subscriber !== ws);
  });
});


// Эндпоинт для получения валют пользователя
app.get('/currencies', authCheck, async (req, res) => {
  try {
    const currencies = await queryDB("SELECT * FROM currencies ORDER BY currency_code ASC");
    res.json({ success: true, data: currencies });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Эндпоинт для покупки валюты
app.post('/currency-buy', authCheck, async (req, res) => {
  const { from, to, amount: rawAmount } = req.body;
  const amount = Number(rawAmount);

  if (isNaN(amount) || amount <= 0) {
    return res.json({ success: false, error: 'Invalid amount' });
  }

  if (!KNOWN_CURRENCY_CODES.includes(from) || !KNOWN_CURRENCY_CODES.includes(to)) {
    return res.json({ success: false, error: 'Unknown currency code' });
  }

  try {
    const fromCurrency = await queryDB("SELECT * FROM currencies WHERE currency_code = $1", [from]);
    const toCurrency = await queryDB("SELECT * FROM currencies WHERE currency_code = $1", [to]);
    const exchangeRate = await getExchangeRate(from, to);

    if (fromCurrency[0].amount < amount) {
      return res.json({ success: false, error: 'Not enough currency' });
    }

    await queryDB("BEGIN");

    await queryDB("UPDATE currencies SET amount = amount::numeric - $1::numeric WHERE currency_code = $2", [amount, from]);
    await queryDB("UPDATE currencies SET amount = amount::numeric + $1::numeric * $2::numeric WHERE currency_code = $3", [amount, exchangeRate, to]);

    await queryDB("COMMIT");

    res.json({ success: true });
  } catch (error) {
    await queryDB("ROLLBACK");
    res.json({ success: false, error: error.message });
  }
});

// Эндпоинт для получения списка банков
app.get('/banks', (req, res) => {
  const POINTS_LIST = Object.freeze([
    { lat: 44.878414, lon: 39.190289 },
		{ lat: 44.6098268, lon: 40.1006606 },
		{ lat: 51.9581028, lon: 85.9603235 },
		{ lat: 52.4922513, lon: 82.7793606 },
		{ lat: 53.3479968, lon: 83.7798064 },
		{ lat: 44.6344864, lon: 39.1354738 },
		{ lat: 44.8950433, lon: 37.3163282 },
		{ lat: 45.0401604, lon: 38.9759647 },
		{ lat: 44.7235026, lon: 37.7686135 },
		{ lat: 45.2603626, lon: 38.1259774 },
		{ lat: 43.5854551, lon: 39.7231548 },
		{ lat: 45.2610949, lon: 37.4454412 },
		{ lat: 44.9482948, lon: 34.1001151 },
		{ lat: 45.190629, lon: 33.367634 },
		{ lat: 45.3562627, lon: 36.4674513 },
		{ lat: 44.4953612, lon: 34.166308 },
		{ lat: 55.7540471, lon: 37.620405 },
		{ lat: 55.830690, lon: 37.518810 },
		{ lat: 55.829411, lon: 37.643015 },
		{ lat: 55.748041, lon: 37.646865 },
		{ lat: 55.720713, lon: 37.626331 },
		{ lat: 55.740991, lon: 37.679561 },
		{ lat: 55.670706, lon: 37.759068 },
		{ lat: 55.627540, lon: 37.656112 },
		{ lat: 59.9391313, lon: 30.3159004 },
		{ lat: 59.945220, lon: 30.266218 },
		{ lat: 59.961265, lon: 30.295690 },
		{ lat: 59.978295, lon: 30.420077 },
		{ lat: 59.893296, lon: 30.464415 },
		{ lat: 59.851047, lon: 30.255081 },
		{ lat: 59.910094, lon: 30.329551 },
		{ lat: 59.850012, lon: 30.457657 },
  ]);

  res.json({ success: true, data: POINTS_LIST });
});

// Обработка неправильных маршрутов
app.post('*', (req, res) => {
  res.json({ success: false, error: 'Invalid route' });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен по адресу http://localhost:${port}`);
});

// Пример функции для получения курса обмена
async function getExchangeRate(from, to) {
  try {
    // Создаем строку вида "AUD/BTC" для поиска в столбце currency_pair
    const currencyPair = `${from}/${to}`;
    
    const result = await queryDB(
      "SELECT rate FROM exchange_rates WHERE currency_pair = $1",
      [currencyPair]
    );
    
    return result.length > 0 ? result[0].rate : 1; // Возвращаем 1, если курс не найден
  } catch (error) {
    console.error("Ошибка при получении курса обмена:", error);
    return 1; // В случае ошибки возвращаем курс 1
  }
}


