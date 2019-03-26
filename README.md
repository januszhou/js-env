## NodeJS environment variables configuration

### Introduction

`node-env-config` is a easy NodeJS ENV configure for 
1. avoiding local env changed accidentally
2. adding config to `process.env.XXX`

### Install
```
npm install --save n-env-config
```

### Usage
```bash
// your folder structure

├── src
│   ├── config
│   │   ├── local.env.ts
│   │   ├── qa.ts
│   │   ├── production.ts
│   ├── config.js
│   ├── database.js
└── .gitignore
```

```javascript
// config.js
import loadConfig from 'n-env-config';
import path from 'path'
export const getConfig = loadConfig({
  folderPath: path.join(__dirname, "./config"),
  localName: "local.env",
  env: process.env.NODE_ENV
  setEnv: true
});

// database.js
import { getConfig } from './config';
const someConfig = getConfig("path.to.config");
// when setEnv: true
// all env config use uppercase
const someConfig = process.env.PATH_TO_CONFIG;
// array env access
const arrayConfig = process.env.PATH_TO_CONFIG_0_KEY;
```

You should add `local.env.js[ts]` into `.gitignore`.

### Road map
- Separate configuration support from `package.json`
- Add more extensions, eg. json, json5 and yaml