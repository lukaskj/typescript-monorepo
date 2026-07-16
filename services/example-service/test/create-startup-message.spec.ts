import { describe, expect, it } from "vitest";

import { createStartupMessage } from "../src/create-startup-message.js";

describe("createStartupMessage", () => {
  it("uses the shared package greeting", () => {
    expect(createStartupMessage()).toBe("Hello, monorepo!");
  });
});
