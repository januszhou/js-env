import { path, mergeDeepLeft } from 'ramda';

export interface EnvConfigOption {
  folderPath: string
  localName: string
  setEnv: boolean
};

const defaultOptions = {
  localName: ".env.local.js",
  setEnv: false
};

const loadFile = (optional: boolean) => (path: string) => {
  try {
    return require(path);
  } catch(e){
    if(!optional){
      throw new Error(`Config file ${path} cannot be read`);
    }
    return undefined;
  }
}

const getProperty = (config: any) => (property: string) => {
  const pathArray = property.split('.');
  return path(pathArray)(config);
};

const setEnvFromConfig = (_config: any) => {
  // set into env
  // config;
}

// overwrite priority .local.js > [env].js
let config = {};

const loadConfig = (option: EnvConfigOption): any => {
  const options = mergeDeepLeft(defaultOptions, option);
  const optionalLoadFile = loadFile(true);
  const requiredLoadFile = loadFile(false);
  // if NODE_ENV is undefined, local config is required
  if(!process.env.NODE_ENV){
    config = requiredLoadFile(`${options.folderPath}/${options.localName}`);
  } else {
    const localConfig = optionalLoadFile(`./${options.localName}`) || {};
    const envFilePath = `${options.folderPath}/${process.env.NODE_ENV}.js`;
    const envConfig = requiredLoadFile(envFilePath);
    config = mergeDeepLeft(envConfig, localConfig);
  }

  if(options.setEnv === true){
    setEnvFromConfig(config);
  }

  return getProperty(config);
}

export default loadConfig;