import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { spooky } from "../functions/forming.ts";

const joining = DefineWorkflow({
  callback_id: "joining_chan",
  title: "Join the channel",
  description: "This is a very legit program",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["interactivity", "user"],
  },
});

joining.addStep(spooky, {
  interactivity: joining.inputs.interactivity,
  user: joining.inputs.user,
});

export default joining;
