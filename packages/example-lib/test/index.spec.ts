import { describe, expect, it } from "vitest";

import { greet } from "../src/index.ts";

describe("greet", () => {
  it("returns friendly greeting", () => {
    expect(greet("Vitest")).toBe("Hello, Vitest!");
  });
});
