import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PermissionLevel,
  formatPermissionLevelName,
  isPermissionSufficient,
} from "../src/index.js";

describe("Permissions System", () => {
  describe("formatPermissionLevelName", () => {
    it("maps permission levels to human readable names", () => {
      assert.equal(formatPermissionLevelName(PermissionLevel.MEMBER), "Member");
      assert.equal(formatPermissionLevelName(PermissionLevel.DJ), "DJ");
      assert.equal(
        formatPermissionLevelName(PermissionLevel.SERVER_ADMIN),
        "Server Admin"
      );
      assert.equal(
        formatPermissionLevelName(PermissionLevel.BOT_ADMIN),
        "Bot Admin"
      );
      assert.equal(
        formatPermissionLevelName(PermissionLevel.BOT_OWNER),
        "Bot Owner"
      );
    });
  });

  describe("isPermissionSufficient", () => {
    it("enforces strict hierarchical tier access", () => {
      // Member level checks
      assert.equal(
        isPermissionSufficient(PermissionLevel.MEMBER, PermissionLevel.MEMBER),
        true
      );
      assert.equal(
        isPermissionSufficient(PermissionLevel.MEMBER, PermissionLevel.DJ),
        false
      );

      // DJ level checks
      assert.equal(
        isPermissionSufficient(PermissionLevel.DJ, PermissionLevel.MEMBER),
        true
      );
      assert.equal(
        isPermissionSufficient(PermissionLevel.DJ, PermissionLevel.DJ),
        true
      );
      assert.equal(
        isPermissionSufficient(
          PermissionLevel.DJ,
          PermissionLevel.SERVER_ADMIN
        ),
        false
      );

      // Bot Owner can perform everything
      assert.equal(
        isPermissionSufficient(
          PermissionLevel.BOT_OWNER,
          PermissionLevel.SERVER_ADMIN
        ),
        true
      );
      assert.equal(
        isPermissionSufficient(
          PermissionLevel.BOT_OWNER,
          PermissionLevel.BOT_OWNER
        ),
        true
      );
    });
  });
});
