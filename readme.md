## Требования
1. [Node.js](https://nodejs.org/en/download/)
2. [PostgreSQL](https://www.postgresql.org/download/)

## Клонирование
```bash
git clone https://github.com
cd questions_and_answers
```

## Конфигурация серверной части
```bash
mv .env .env.example
```
Заполните поля в `.env` файле

## Установка и запуск серверной части
```bash
cd server
yarn install
yarn start
```

## Запуск серверной части в режиме разработки
```bash
yarn dev
```

## Установка и запуск клиентской части
```bash
cd client
yarn install
yarn start
```

## Сборка клиентской части
```bash
yarn build
```

## Запуск тестов
```bash
yarn test
```