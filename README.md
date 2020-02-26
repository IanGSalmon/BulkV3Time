# How to use

## Install Dependencies
```shell
npm install
```
## Set environment variables for BASE_URL, USER_SECRET, ORG_SECRET
- E.g. ~/.bash_profile
```bash
export BASE_URL='https://staging.cloud-elements.com'
export USER_SECRET='asdfghjklasdfghV7ITgw5h3ZbcuxC5HNDD5pXqPqSU='
export ORG_SECRET='asdfghjklasdfghMnmVYOkkCOXkMZZk5yMgw0raZk/4='
```

## Adjust variables in index.js to suit your use case

- E.g. ./index.js
```javascript
const ELEMENT_KEY = "sadfdsfsfhasldjfhInN0sDLiBBI=";
const q = "SELECT * from defects WHERE LastUpdateDate>'2020-02-22T06:00:00'";
const pageSize = 200;
```
