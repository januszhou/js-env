import * as R from "ramda";

export interface EnvConfigOption {
  folderPath: string;
  localName: string;
  env: string | undefined;
  setEnv?: boolean;
}

const loadFile = (optional: boolean) => (path: string) => {
  try {
    const file = require(path);
    return file.default;
  } catch (e) {
    if (!optional) {
      throw new Error(`Config file ${path} cannot be read`);
    }
    return undefined;
  }
};

const getProperty = (config: any) => (property: string) => {
  const pathArray = property.split(".");
  return R.path(pathArray)(config);
};

export const flatConfig = (config: any): [string, any][] => {
  const makeKey = (...keys: string[]) => {
    const toUpper = R.pipe(
      String,
      R.toUpper
    );
    return R.pipe(
      R.map(toUpper),
      R.join("_")
    )(keys);
  };

  const go = ([k, v]: [string, any]): any => {
    if (R.type(v) === "Object" || R.type(v) === "Array") {
      return R.map(([k_, v_]) => [`${makeKey(k, k_)}`, v_], loop(v));
    } else {
      return [[makeKey(k), v]];
    }
  };

  const loop = (obj: any): [string, any][] => R.chain(go, R.toPairs(obj));

  return loop(config);
};

export const setEnvFromConfig = (config: any): void => {
  const flattenConfig = flatConfig(config);
  for (const c of flattenConfig) {
    const [k, v]: [string, any] = c;
    process.env[k] = v;
  }
};

const loadConfig = (option: EnvConfigOption): any => {
  const defaultOptions = {
    localName: ".env.local",
    setEnv: false,
    env: undefined
  };

  let config = {};
  // overwrite priority .local.js > [env].js
  const { folderPath, localName, setEnv, env } = R.mergeDeepRight(
    defaultOptions,
    option
  );

  const optionalLoad = loadFile(true);
  const requiredLoad = loadFile(false);
  // if NODE_ENV is undefined, local config is required
  if (env == undefined) {
    config = requiredLoad(`${folderPath}/${localName}`) || {};
  } else {
    const localConfig = optionalLoad(`${folderPath}/${localName}`) || {};
    const envFilePath = `${folderPath}/${env}`;
    const envConfig = requiredLoad(envFilePath);
    config = R.mergeDeepRight(envConfig, localConfig);
  }

  if (setEnv === true) {
    setEnvFromConfig(config);
  }

  return getProperty(config);
};

export default loadConfig;
