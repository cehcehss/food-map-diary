### DEMO

### Setup Datebase

**Create and use food-map-diary MySQL database**

```
drop database if exists food-map-diary;
create database food-map-diary;
use food-map-diary;
```

### Setup App

**Enter the project folder**

```
$ cd food-map-diary
```

**Install packages via npm**

```
$ npm install
```

**Create config.json file in confile folder**

> /config/config.json
```
"development": {
  "username": "root",
  "password": "<YOUR_MySQL_WORKBENCH_PASSWORD>",
  "database": "food-map-diary",
  "host": "127.0.0.1",
  "dialect": "mysql",
  "operatorsAliases": false
}

```

**Create models**

> run the following code in the console
```
$ npx sequelize db:migrate
```

**Insert data into MySQL table**
> execute SQL script of food-map-diary.sql 


**Activate the server**

```
$ npm start
```

**Find the message for successful activation**

```
> App is running on port 3000!
```
You may visit the application on browser with the URL: http://localhost:3000
