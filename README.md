# AquiRe Systems

## Dependencies
- [MySQL](https://dev.mysql.com/downloads/installer/)
- [Node.js v18.16.0 or above](https://nodejs.org/en/download)
- [Node Package Manager v9.7.1](https://nodejs.org/en/download)

## Running AquiRe
1. Clone the repository, or download and unzip the source files.
2. Install the necessary packages using npm.
```bash
npm install
```
3. Create a MySQL connection in MySQL Workbench or through MySQL CLI.
4. Create an .env file with the following fields:
```
PORT=[port of the network application | default is 3000]

DB_NAME=[name of the database]
DB_USERNAME=[username of the DB admin user]
DB_PASSWORD=[password of the DB admin user]
```
5. Run it by calling the npm script:
```bash
npm start
```
