import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SolaceEmbed, SOLACE_COLORS } from "../src/utils/embeds.js";

describe("Bot Embed Builders", () => {
  it("initializes SolaceEmbed with default primary color and timestamp", () => {
    const embed = new SolaceEmbed();
    const data = embed.toJSON();
    assert.equal(data.color, SOLACE_COLORS.PRIMARY);
    assert.ok(data.timestamp);
  });

  it("builds success embed with green color", () => {
    const embed = SolaceEmbed.success("Track Added", "Playing immediately");
    const data = embed.toJSON();
    assert.equal(data.color, SOLACE_COLORS.SUCCESS);
    assert.equal(data.title, "✅ Track Added");
    assert.equal(data.description, "Playing immediately");
  });

  it("builds error embed with crimson color", () => {
    const embed = SolaceEmbed.error("Permission Denied", "Requires DJ role");
    const data = embed.toJSON();
    assert.equal(data.color, SOLACE_COLORS.ERROR);
    assert.equal(data.title, "❌ Permission Denied");
    assert.equal(data.description, "Requires DJ role");
  });
});
