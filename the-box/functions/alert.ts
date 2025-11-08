import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const byebye = DefineFunction({
  callback_id: "alertme",
  title: "Who left?",
  description: "Idk who left, I need to know!",
  source_file: "functions/alert.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Does this work?",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
    },
    required: ["channel", "user"],
  },
});

export default SlackFunction(
  byebye,
  async ({ inputs, client }) => {
    const open = await client.conversations.open({
      users: "U091EPSQ3E3",
    });

    await client.chat.postMessage({
      channel: open.channel.id,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Hey there! <@${inputs.user}> just left <#${inputs.channel}>!\n`,
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Ok, so, send to channel?`,
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Yes!"
              },
              "action_id": "yespost",
              "value": JSON.stringify({ user: inputs.user, channel: inputs.channel }),
              "style": "primary"
            },
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "No!"
              },
              "action_id": "nodo",
              "style": "danger"
            }
          ]
        }
      ]
    });

    return { completed: false, outputs: undefined };
  },
).addBlockActionsHandler("yespost", async ({ body, client }) => {
  if (body.message && body.channel) {
    const blocks = body.message.blocks.map(block => {
      if (block.type === "actions" && Array.isArray(block.elements)) {
        const elements = block.elements.filter(
          (el: any) => el.action_id !== "yespost" && el.action_id !== "nodo"
        );
        if (elements.length === 0) return null;
        return { ...block, elements };
      }
      return block;
    }).filter(Boolean);
    await client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      blocks: [
        ...blocks,
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": `Got it! Sending to channel...`
            }
          ]
        },
      ]
    });
  }
  const raw = body.actions?.[0]?.value || "{}";
  const payload: { user?: string; channel?: string } = JSON.parse(raw);
  const leaver = payload.user;
  const chan = payload.channel;

  if (leaver && chan) {
    await client.chat.postMessage({
      channel: chan,
      text: `Nooo! <@${leaver}> has left the chat :cryin:.`,
    });
  }
  return { outputs: {} };

}).addBlockActionsHandler("noout", async ({ body, client }) => {
  if (body.message && body.channel) {
    const blocks = body.message.blocks.map(block => {
      if (block.type === "actions" && Array.isArray(block.elements)) {
        const elements = block.elements.filter(
          (el: any) => el.action_id !== "yespost" && el.action_id !== "nodo"
        );
        if (elements.length === 0) return null;
        return { ...block, elements };
      }
      return block;
    }).filter(Boolean);
    await client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      blocks: [
        ...blocks,
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": `Got it! Won't send to channel!`
            }
          ]
        },
      ]
    });
  }
  return { outputs: {} };
});
