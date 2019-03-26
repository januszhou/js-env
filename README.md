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

#### Fold structure

```javascript
// file config.js
import loadConfig from 'n-env-config';
export const getConfig = loadConfig({
  folderName: "config",
  localName: ".env.local.js",
  setEnv: true
});

// anywhere else, import config.js
import { getConfig } from '../path/to/config';
const someConfig = getConfig("path.to.config");

// when setEnv: true
// all env config use uppercase
const someConfig = process.env.PATH_TO_CONFIG;

// array env access
const arrayConfig = process.env.PATH_TO_CONFIG_0_KEY;
```

### Road map
- Separate configuration support from `package.json`
- Add more extensions, eg. json, json5 and yaml