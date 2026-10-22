import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { db } from "../src/index.js";

describe("Database Layer & In-Memory Resilient Store", () => {
  const testGuildId = "999888777666555444";
  const testUserId = "111222333444555666";

  it("fetches default configuration for a new guild", async () => {
    const config = await db.getGuildConfig(testGuildId);
    assert.equal(config.guildId, testGuildId);
    assert.equal(config.defaultVolume, 80);
    assert.equal(config.twentyFourSeven, false);
    assert.equal(config.prefix, "!");
  });

  it("updates guild settings and persists changes", async () => {
    const updated = await db.updateGuildConfig(testGuildId, {
      defaultVolume: 65,
      twentyFourSeven: true,
      djRoleId: "role_12345",
      voteSkipRatio: 0.6,
    });

    assert.equal(updated.defaultVolume, 65);
    assert.equal(updated.twentyFourSeven, true);
    assert.equal(updated.djRoleId, "role_12345");
    assert.equal(updated.voteSkipRatio, 0.6);

    // Verify retrieval
    const retrieved = await db.getGuildConfig(testGuildId);
    assert.equal(retrieved.defaultVolume, 65);
    assert.equal(retrieved.twentyFourSeven, true);
  });

  it("creates, modifies, and queries custom playlists", async () => {
    const playlist = await db.createPlaylist(testUserId, "Synthwave Chill", false);
    assert.equal(playlist.name, "Synthwave Chill");
    assert.equal(playlist.userId, testUserId);
    assert.equal(playlist.tracks.length, 0);

    // Add track
    const trackAdded = await db.addTrackToPlaylist(testUserId, "Synthwave Chill", {
      title: "Resonance",
      author: "HOME",
      uri: "https://www.youtube.com/watch?v=8GW6sLrK40k",
      duration: 212000,
    });
    assert.equal(trackAdded, true);

    // Retrieve playlists
    const userPlaylists = await db.getUserPlaylists(testUserId);
    const found = userPlaylists.find((p) => p.id === playlist.id);
    assert.ok(found);
    assert.equal(found.tracks.length, 1);
    assert.equal(found.tracks[0].title, "Resonance");
  });
});
