## NodeJS environment variables configuration 

### Introduction

`node-env-config`

### Install
```
npm install --save n-env-config
```

### Usage

```javascript
// file config.js
import { loadConfig } from 'n-env-config';
export const config = loadConfig({
  folderName: "config",
  localName: ".env.local.js",
  setEnv: true
});

// anywhere else, import config.js
import { config } from '../path/to/config';
const someConfig = config("path.to.config");

// when setEnv: true
const someConfig = process.env.PATH_TO_CONFIG;
```

### Config

### Roadmap
- Separate configuration support from `package.json`
- Add more extensions, eg. json, json5 and yaml
- Add executable script to copy `.example.js` to `.local.js`;