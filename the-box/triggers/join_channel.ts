import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import joining from "../workflows/onboarding.ts";

const joiner: Trigger<typeof joining.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Join my secret channel!",
  description: "Ooh, something secret? It's Shadowlight's channel after all!",
  workflow: `#/workflows/${joining.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    user: {
      value: TriggerContextData.Shortcut.user_id,
    },
  },
};

export default joiner;
