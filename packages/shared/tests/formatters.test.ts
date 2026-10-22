import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatDuration, parseDuration } from "../src/formatters.js";

describe("Duration Formatters & Parsers", () => {
  describe("formatDuration", () => {
    it("formats zero and negative values as 00:00", () => {
      assert.equal(formatDuration(0), "00:00");
      assert.equal(formatDuration(-100), "00:00");
      assert.equal(formatDuration(Number.NaN), "00:00");
    });

    it("formats seconds and minutes correctly", () => {
      assert.equal(formatDuration(5000), "00:05");
      assert.equal(formatDuration(65000), "01:05");
      assert.equal(formatDuration(215000), "03:35");
    });

    it("formats hours, minutes, and seconds correctly", () => {
      assert.equal(formatDuration(3600000), "01:00:00");
      assert.equal(formatDuration(3665000), "01:01:05");
      assert.equal(formatDuration(86400000), "24:00:00");
    });
  });

  describe("parseDuration", () => {
    it("parses MM:SS format correctly", () => {
      assert.equal(parseDuration("03:45"), 225000);
      assert.equal(parseDuration("0:30"), 30000);
    });

    it("parses HH:MM:SS format correctly", () => {
      assert.equal(parseDuration("01:23:45"), 5025000);
      assert.equal(parseDuration("2:00:00"), 7200000);
    });

    it("parses labeled unit strings (h, m, s)", () => {
      assert.equal(parseDuration("90s"), 90000);
      assert.equal(parseDuration("5m"), 300000);
      assert.equal(parseDuration("1h 30m"), 5400000);
      assert.equal(parseDuration("2h 15m 10s"), 8110000);
    });

    it("parses raw numeric seconds", () => {
      assert.equal(parseDuration("120"), 120000);
      assert.equal(parseDuration("45"), 45000);
    });

    it("returns null on invalid input", () => {
      assert.equal(parseDuration(""), null);
      assert.equal(parseDuration("invalid"), null);
      assert.equal(parseDuration("abc:def"), null);
      assert.equal(parseDuration("-10"), null);
    });
  });
});
