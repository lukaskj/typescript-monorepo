import { greet } from "@workspace/example-lib";

export function createStartupMessage() {
  return greet("monorepo");
}
