## JS env variables 

### Install
```
npm install --save js-env 
yarn add js-env
```

### Usage
```bash
// your folder structure

├── src
│   ├── config
│   │   ├── local.ts[js]
│   │   ├── qa.ts[js]
│   │   ├── production.ts[js]
│   ├── config.js
│   ├── database.js
└── .gitignore
```

```javascript
// src/config/local.js
export default {
  path: {
    to: {
      config: "local",
      otherConfig: process.env.TEST
    }
  }
}

// src/config/qa.js
export default {
  path: {
    to: {
      config: "qa",
      otherConfig: process.env.TEST
    }
  }
}
```


```javascript
// src/config.js
import loadConfig from 'n-env-config';
import path from 'path';

const commonConfig = {
  common: "a",
  anotherCommon: "b"
};
export const getConfig = loadConfig({
  folderPath: path.join(__dirname, "./config"),
  env: process.env.NODE_ENV,
  shared: commonConfig,
  defaultEnv: "local"
});

// src/database.js
import { getConfig } from './config';
const someConfig = getConfig("path.to.config");
const configWithDefaultVal = getConfig("port", 4000);
```

You **should** add `src/config/local.js[ts]` into `.gitignore`.