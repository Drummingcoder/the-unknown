import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import leaver from "../workflows/leave.ts";

const leaveme: Trigger<typeof leaver.definition> = {
  type: TriggerTypes.Event,
  name: "Someone left",
  event: {
    event_type: TriggerEventTypes.UserLeftChannel,
    all_resources: true,
  },
  description: "Nooo someone left!",
  workflow: `#/workflows/${leaver.definition.callback_id}`,
  inputs: {
    user: {
      value: TriggerContextData.Event.UserLeftChannel.user_id,
    },
    channel: {
      value: TriggerContextData.Event.UserLeftChannel.channel_id,
    }
  },
};

export default leaveme;
