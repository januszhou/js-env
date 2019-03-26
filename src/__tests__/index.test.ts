import loadConfig, { flatConfig, setEnvFromConfig } from "../index";
import path from "path";

test("flat config works as expect", () => {
  expect(flatConfig({})).toEqual([]);
  expect(flatConfig({ a: 1 })).toEqual([["A", 1]]);
  expect(flatConfig({ a: { b: 1 } })).toEqual([["A_B", 1]]);
  expect(flatConfig({ a: { b: { c: 1 } } })).toEqual([["A_B_C", 1]]);
  expect(flatConfig({ a: { b: { c: ["foo", "bar"] } } })).toEqual([
    ["A_B_C_0", "foo"],
    ["A_B_C_1", "bar"]
  ]);
  expect(flatConfig({ a: [{ b: 1 }, { c: "foo" }, 3] })).toEqual([
    ["A_0_B", 1],
    ["A_1_C", "foo"],
    ["A_2", 3]
  ]);
});

test("set env works", () => {
  setEnvFromConfig({ a: { b: { c: ["foo", "bar"] } } });
  expect(process.env.A_B_C_0).toEqual("foo");
  expect(process.env.A_B_C_1).toEqual("bar");
});

describe("load config works", () => {
  test("loading local env works", () => {
    const getConfig = loadConfig({
      localName: "local.env",
      folderPath: path.join(__dirname, "./config"),
      env: undefined
    });
    expect(getConfig("testing.test1")).toEqual("a");
    expect(getConfig("testing.test2")).toEqual({ b: 1 });
  });
  test("loading qa env by using local env to overwrite", () => {
    const getConfig = loadConfig({
      localName: "local.env",
      folderPath: path.join(__dirname, "./config"),
      env: "qa"
    });
    expect(getConfig("testing.test1")).toEqual("a"); // overwrite by local
    expect(getConfig("testing.test2")).toEqual({ b: 1 }); // overwrite by local
    expect(getConfig("testing.test3")).toEqual([4, 5, 6]);
  });
  test("loading production env by using local env to overwrite", () => {
    const getConfig = loadConfig({
      localName: "local.env",
      folderPath: path.join(__dirname, "./config"),
      env: "production"
    });
    expect(getConfig("testing.test1")).toEqual("a"); // overwrite by local
    expect(getConfig("testing.test2")).toEqual({ b: 1 }); // overwrite by local
    expect(getConfig("testing.test3")).toEqual([1, 2, 3]);
  });
});
