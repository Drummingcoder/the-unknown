import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import people from "../datastores/results.ts";

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
        close: {
          type: "plain_text",
          text: "Run away",
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
              text: "Did that get you? If not, let's continue...\n",
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Let's have a fun little quiz, shall we? Alright, first question, who is not a YSWS sponsor?",
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                action_id: "answer1",
                text: { type: "plain_text", text: "manitej"},
                style: "primary",
                value: "submission11"
              }, 
              {
                type: "button",
                action_id: "answer2",
                text: { type: "plain_text", text: "Felix Gao"},
                style: "primary",
                value: "submission12",
                url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/5567099a8e823c5827ca4b92632b7e8834c84947_mario.gif"
              }
            ]
          }
        ]
      },
    });

    console.log(openfirst);
    return { completed: false, outputs: undefined };
  },
).addBlockActionsHandler("answer1", async ({ body, client }) => {
  await client.apps.datastore.get<
    typeof people.definition
  >({
    datastore: people.name,
    
  });


  await client.views.update({
    view_id: body.view.id,
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "That is correct!\n"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Next question, who is Christina Asquith?"
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "answer3",
            text: { type: "plain_text", text: "A co-founder of Hack Club"},
            style: "primary",
            value: "submission21"
          }, 
          {
            type: "button",
            action_id: "answer4",
            text: { type: "plain_text", text: "The Creative Lead of Hack Club"},
            style: "primary",
            value: "submission22",
            url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/1108082f2092cf348f4cd0a514606e25a0d95329_trap.gif",
          }
        ]
      }
    ]
  });
  return { completed: false, outputs: undefined };
}).addBlockActionsHandler("answer3", async ({ body, client }) => {
  await client.views.update({
    view_id: body.view.id,
    blocks: [
      {
        "type": "section",
        "elements": [
          {
            "type": "mrkdwn",
            "text": "That is correct!\n"
          }
        ]
      },
      {
        "type": "section",
        "elements": [
          {
            "type": "mrkdwn",
            "text": "Last quiz question: who am I?"
          }
        ]
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "answer5",
            text: { type: "plain_text", text: "An artist who loves to play Hollow Knight"},
            style: "primary",
            value: "submission31",
            url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/99b46b68ad8efc6b4c142a15d360df6be8233252_spring.gif",
          }, 
          {
            type: "button",
            action_id: "answer6",
            text: { type: "plain_text", text: "A programmer who loves to play Genshin Impact"},
            style: "primary",
            value: "submission32"
          }
        ]
      }
    ]
  });
  return { completed: false, outputs: undefined};
}).addBlockActionsHandler("answer6", async ({ body, client}) => {

});
