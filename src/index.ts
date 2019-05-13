import R from "ramda";

export interface EnvConfigOption {
  folderPath: string;
  env: string | undefined;
  shared?: any;
  defaultEnv: string;
}

const loadFile = (path: string) => {
  try {
    const file = require(path);
    return file.default;
  } catch (e) {
    return undefined;
  }
};

const getProperty = (config: any) => (...args: [string, any]) => {
  const [property, defaultVal] = args;
  const pathArray = property.split(".");
  return R.pathOr(defaultVal, pathArray)(config);
};

const loadConfig = (option: EnvConfigOption): any => {
  const defaultOptions = {
    shared: {}
  };
  let config = {};
  const { folderPath, env = "", shared, defaultEnv = "" } = {
    ...defaultOptions,
    ...option
  };
  if (!env && !defaultEnv) {
    throw new Error(`env and defaultEnv can't be empty at the same time`);
  } else {
    let envConfig = {};
    // throw new Error(`Config file ${path} cannot be read`);
    const getEnvFilePath = (env: string) => `${folderPath}/${env}`;
    envConfig = loadFile(getEnvFilePath(env));

    // try to load defaultEnv config
    if (!envConfig) {
      envConfig = loadFile(getEnvFilePath(defaultEnv));
    }

    // throw error if both env and defaultEnv failed
    if (!envConfig) {
      throw new Error(
        `Failed to load config: env: ${env}, defaultEnv: ${defaultEnv}`
      );
    }
    config = R.mergeDeepLeft(envConfig, shared);
  }

  return getProperty(config);
};

export default loadConfig;
