--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    account_id character varying(30) NOT NULL,
    balance numeric(20,2) DEFAULT 0,
    mine boolean
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: currencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currencies (
    currency_code character varying(5) NOT NULL,
    amount numeric(20,8)
);


ALTER TABLE public.currencies OWNER TO postgres;

--
-- Name: exchange_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exchange_rates (
    currency_pair character varying(10) NOT NULL,
    rate numeric(10,5)
);


ALTER TABLE public.exchange_rates OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    date timestamp without time zone,
    from_account character varying(30),
    to_account character varying(30),
    amount numeric(20,2)
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_transaction_id_seq OWNER TO postgres;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (account_id, balance, mine) FROM stdin;
05168707632801844723808510	0.00	f
17307867273606026235887604	0.00	f
2222400070000005	0.00	f
27120208050464008002528428	0.00	f
5555341244441115	0.00	f
61253747452820828268825011	3000.00	f
06831702664643768850722718	0.00	t
15046611883785022567630224	0.00	t
36433458001428635582346130	0.00	f
62702282434234062711153143	10000.00	t
27725131115443483331677476	0.00	t
85386045876688345287026710	0.00	t
03075161147576483308375751	0.00	f
67041330646362260673274687	0.00	f
13041081312380068324803575	0.00	f
bbxc9whnryu	0.00	t
obog93bxyli	0.00	t
74213041477477406320783754	0.00	t
06233763430365547805565371	7901532.51	t
fqxafoybfx9	0.00	t
3.557614910921497e+25	0.00	t
71741261194449237376381569	0.00	t
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currencies (currency_code, amount) FROM stdin;
AUD	22.16000000
BTC	2943.34000000
BYR	48.75000000
CAD	45.22000000
CHF	67.29000000
CNH	10.47000000
EUR	27.85000000
GBP	5.72000000
HKD	78.48000000
JPY	1234524.00000000
NZD	93.44000000
RUB	1034524.10000000
UAH	15.19000000
ETH	0.00888889
USD	231.73000000
\.


--
-- Data for Name: exchange_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exchange_rates (currency_pair, rate) FROM stdin;
AUD/BTC	0.02000
AUD/CHF	0.06000
AUD/CNH	38.69000
AUD/EUR	0.05000
AUD/JPY	36.32000
AUD/NZD	40.59000
AUD/RUB	0.01000
AUD/UAH	0.08000
BTC/BYR	0.01000
BTC/CAD	42.47000
BTC/CHF	16.31000
BTC/EUR	0.02000
BTC/GBP	6.46000
BTC/JPY	0.01000
BTC/USD	80.20000
BYR/AUD	86.12000
BYR/CAD	0.34000
BYR/CHF	0.01000
BYR/EUR	0.06000
BYR/HKD	22.87000
BYR/NZD	0.04000
BYR/RUB	0.05000
CAD/AUD	0.02000
CAD/CHF	94.95000
CAD/CNH	75.83000
CAD/ETH	32.40000
CAD/HKD	0.05000
CAD/JPY	0.02000
CAD/RUB	0.01000
CHF/CNH	0.02000
CHF/ETH	0.01000
CHF/EUR	0.05000
CHF/GBP	75.01000
CHF/HKD	88.73000
CHF/NZD	0.02000
CHF/RUB	1.97000
CHF/UAH	89.85000
CHF/USD	9.36000
CNH/BTC	0.03000
CNH/BYR	48.91000
CNH/HKD	54.11000
CNH/NZD	4.25000
CNH/RUB	0.02000
CNH/UAH	79.71000
CNH/USD	0.18000
ETH/AUD	0.05000
ETH/BTC	15.25000
ETH/BYR	0.02000
ETH/CNH	48.54000
ETH/EUR	41.11000
ETH/GBP	0.01000
ETH/JPY	0.02000
ETH/NZD	59.23000
ETH/RUB	95.43000
EUR/CAD	61.59000
EUR/CNH	69.27000
EUR/GBP	97.06000
EUR/HKD	0.01000
EUR/USD	0.04000
GBP/AUD	79.78000
GBP/BYR	0.26000
GBP/CAD	0.01000
GBP/CNH	0.04000
GBP/HKD	56.74000
GBP/JPY	0.04000
GBP/NZD	0.01000
GBP/UAH	29.24000
HKD/AUD	26.56000
HKD/BTC	75.39000
HKD/ETH	0.02000
HKD/JPY	0.02000
HKD/RUB	0.03000
HKD/UAH	30.79000
JPY/BYR	1.50000
JPY/CHF	0.01000
JPY/CNH	1.37000
JPY/EUR	0.01000
JPY/RUB	0.01000
NZD/BTC	0.04000
NZD/CAD	0.02000
NZD/EUR	59.63000
NZD/HKD	1.21000
NZD/JPY	0.07000
NZD/RUB	0.02000
NZD/UAH	35.04000
RUB/BTC	0.01000
RUB/EUR	0.04000
RUB/GBP	0.02000
RUB/UAH	13.02000
UAH/BTC	0.34000
UAH/BYR	41.58000
UAH/CAD	35.49000
UAH/ETH	0.34000
UAH/EUR	55.71000
UAH/JPY	1.60000
UAH/USD	24.86000
USD/AUD	12.65000
USD/BYR	0.02000
USD/CAD	16.15000
USD/ETH	0.01000
USD/GBP	0.01000
USD/HKD	25.93000
USD/JPY	81.82000
USD/NZD	0.06000
USD/RUB	82.11000
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (transaction_id, date, from_account, to_account, amount) FROM stdin;
1	2020-09-21 10:19:41.656	03075161147576483308375751	74213041477477406320783754	5299.09
2	2024-11-08 10:50:28.784	67041330646362260673274687	74213041477477406320783754	145.26
3	2024-11-08 17:38:41.364	13041081312380068324803575	74213041477477406320783754	214.38
4	2024-04-01 06:17:30.858	06233763430365547805565371	74213041477477406320783754	0.00
5	2024-04-01 06:18:44.613	74213041477477406320783754	06233763430365547805565371	8889.00
6	2024-04-01 06:59:26.317	74213041477477406320783754	36433458001428635582346130	0.00
7	2024-04-01 13:04:05.954	74213041477477406320783754	62702282434234062711153143	10000.00
8	2024-04-01 06:18:44.613	74213041477477406320783754	06233763430365547805565371	1234.00
9	2024-04-01 06:59:26.317	74213041477477406320783754	36433458001428635582346130	23.00
10	2024-04-01 13:04:05.954	74213041477477406320783754	62702282434234062711153143	300.00
11	2024-04-01 06:18:44.613	74213041477477406320783754	06233763430365547805565371	401.00
12	2024-04-01 06:59:26.317	74213041477477406320783754	36433458001428635582346130	41.00
13	2024-04-01 13:04:05.954	74213041477477406320783754	62702282434234062711153143	102.00
14	2024-04-01 06:18:44.613	74213041477477406320783754	06233763430365547805565371	40.00
15	2024-04-01 06:59:26.317	74213041477477406320783754	36433458001428635582346130	50.00
16	2024-04-01 13:04:05.954	74213041477477406320783754	62702282434234062711153143	10.00
17	2024-11-10 12:52:58.969	74213041477477406320783754	06233763430365547805565371	7000000.00
18	2024-11-10 12:54:57.442	74213041477477406320783754	06233763430365547805565371	892643.51
\.


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_transaction_id_seq', 18, true);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (account_id);


--
-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (currency_code);


--
-- Name: exchange_rates exchange_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_pkey PRIMARY KEY (currency_pair);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: transactions transactions_from_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_from_account_fkey FOREIGN KEY (from_account) REFERENCES public.accounts(account_id);


--
-- Name: transactions transactions_to_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_to_account_fkey FOREIGN KEY (to_account) REFERENCES public.accounts(account_id);


--
-- PostgreSQL database dump complete
--

