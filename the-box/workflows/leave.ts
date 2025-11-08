import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { byebye } from "../functions/alert.ts";

const leaver = DefineWorkflow({
  callback_id: "leave_chan",
  title: "Leave the channel",
  description: "Get em!",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["channel", "user"],
  },
});

leaver.addStep(byebye, {
  user: leaver.inputs.user,
  channel: leaver.inputs.channel,
});

export default leaver;
