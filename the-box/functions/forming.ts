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
        type: Schema.slack.types.interactivity,
        description: "Does this work?",
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
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: {
        callback_id: "first",
        type: "modal",
        title: {
          type: "plain_text",
          text: "Come in!"
        },
        submit: {
          type: "plain_text",
          text: "Submit",
        },
        blocks: [
          {
            type: "image",
            image_url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/883739cb057a05e23226a064b9f58e73ffdba73c_scary.gif",
            alt_text: "Get scared, buddy!",
            title: { type: "plain_text", text: "Booooo!"},
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Did that get you? If not, let's continue...",
            }
          }
        ]
      },
    });

    console.log(openfirst);

    return { completed: false, outputs: undefined };
  },
);
