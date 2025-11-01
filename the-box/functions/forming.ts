import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import type SampleObjectDatastore from "../datastores/sample_datastore.ts";

export const spooky = DefineFunction({
  callback_id: "spook",
  title: "Scary coming in",
  description: "Forms and stuff to jumpscare and fill out",
  source_file: "functions/forming.ts",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
    },
    required: ["interactivity", "user"],
  },
});

export default SlackFunction(
  spooky,
  async ({ inputs, client }) => {
    const openfirst = await client.views.open({
      interactivity_pointer: inputs.interactivity,
      views: [
        {
          
        },
      ],
    });

    return { outputs: { } };
  },
);
