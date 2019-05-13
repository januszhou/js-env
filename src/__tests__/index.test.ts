import loadConfig from "../index";
import path from "path";

describe("load config works", () => {
  test("loading local env", () => {
    const getConfig = loadConfig({
      folderPath: path.join(__dirname, "./config"),
      env: "local",
      defaultEnv: "local"
    });
    expect(getConfig("testing.test1")).toEqual("a");
    expect(getConfig("testing.test2")).toEqual({ b: 1 });
  });
  test("loading qa env", () => {
    const getConfig = loadConfig({
      folderPath: path.join(__dirname, "./config"),
      env: "qa",
      defaultEnv: "local"
    });
    expect(getConfig("testing.test1")).toEqual("qa");
    expect(getConfig("testing.test2")).toEqual({ b: 2 });
    expect(getConfig("testing.test3")).toEqual([4, 5, 6]);
  });
  test("loading random env by using local env as default", () => {
    const getConfig = loadConfig({
      folderPath: path.join(__dirname, "./config"),
      env: "notExist",
      defaultEnv: "local"
    });
    expect(getConfig("testing.test1")).toEqual("a");
    expect(getConfig("testing.test2")).toEqual({ b: 1 });
  });
});
