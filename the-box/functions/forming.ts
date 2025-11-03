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
    await client.apps.datastore.put<
      typeof people.definition
    >({
      datastore: people.name,
      item: {
        user_id: inputs.user,
        clicked: true,
      },
    });
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
  const getResp1 = await client.apps.datastore.get<
    typeof people.definition
  >({
    datastore: people.name,
    id: body.user.id,
  });
  
  if (! getResp1.item.question1) {
    await client.apps.datastore.update<
      typeof people.definition
    >({
      datastore: people.name,
      item: {
        user_id: body.user.id,
        question1: false,
      },
    });
  }
  
  const rep = await client.views.update({
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
          "text": "Next question, who is this?"
        }
      },
      {
        type: "image",
        image_url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/1a80c3b9e0a31db5cc52fbc23e11c56962989d68_image.png",
        alt_text: "mystery",
        title: { type: "plain_text", text: "Who?"},
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "answer4",
            text: { type: "plain_text", text: "Arataki Itto"},
            style: "primary",
            value: "submission22",
            url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/1108082f2092cf348f4cd0a514606e25a0d95329_trap.gif",
          },
          {
            type: "button",
            action_id: "answer3",
            text: { type: "plain_text", text: "Kamisato Ayato"},
            style: "primary",
            value: "submission21"
          },
        ]
      }
    ]
  });
  console.log(rep);
  return { completed: false, outputs: undefined };
}).addBlockActionsHandler("answer2", async ({ body, client}) => {
  await client.apps.datastore.update<
    typeof people.definition
  >({
    datastore: people.name,
    item: {
      user_id: body.user.id,
      question1: true,
    },
  });

  const rep = await client.views.update({
    view_id: body.view.id,
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Incorrect...\n"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Next question, who is this?"
        }
      },
      {
        type: "image",
        image_url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/1a80c3b9e0a31db5cc52fbc23e11c56962989d68_image.png",
        alt_text: "mystery",
        title: { type: "plain_text", text: "Who?"},
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "answer4",
            text: { type: "plain_text", text: "Arataki Itto"},
            style: "primary",
            value: "submission22",
            url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/1108082f2092cf348f4cd0a514606e25a0d95329_trap.gif",
          },
          {
            type: "button",
            action_id: "answer3",
            text: { type: "plain_text", text: "Kamisato Ayato"},
            style: "primary",
            value: "submission21"
          },
        ]
      }
    ]
  });
  console.log(rep);

  return { completed: false, outputs: undefined };
}).addBlockActionsHandler("answer3", async ({ body, client }) => {
  const getResp1 = await client.apps.datastore.get<
    typeof people.definition
  >({
    datastore: people.name,
    id: body.user.id,
  });
  if (! getResp1.item.question2) {
    await client.apps.datastore.update<
      typeof people.definition
    >({
      datastore: people.name,
      item: {
        user_id: body.user.id,
        question2: false,
      },
    });
  }

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
          "text": "Last quiz question: who am I?"
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "answer5",
            text: { type: "plain_text", text: "An artist"},
            style: "primary",
            value: "submission31",
            url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/99b46b68ad8efc6b4c142a15d360df6be8233252_spring.gif",
          }, 
          {
            type: "button",
            action_id: "answer6",
            text: { type: "plain_text", text: "A programmer"},
            style: "primary",
            value: "submission32"
          }
        ]
      }
    ]
  });
  return { completed: false, outputs: undefined};
}).addBlockActionsHandler("answer4", async ({ body, client}) => {
  await client.apps.datastore.update<
    typeof people.definition
  >({
    datastore: people.name,
    item: {
      user_id: body.user.id,
      question2: true,
    },
  });
  
  await client.views.update({
    view_id: body.view.id,
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Incorrect...\n"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Last quiz question: who am I?"
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            action_id: "answer5",
            text: { type: "plain_text", text: "An artist"},
            style: "primary",
            value: "submission31",
            url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/99b46b68ad8efc6b4c142a15d360df6be8233252_spring.gif",
          }, 
          {
            type: "button",
            action_id: "answer6",
            text: { type: "plain_text", text: "A programmer"},
            style: "primary",
            value: "submission32"
          }
        ]
      }
    ]
  });

  return { completed: false, outputs: undefined };
}).addBlockActionsHandler("answer5", async ({ body, client}) => {
  await client.apps.datastore.update<
    typeof people.definition
  >({
    datastore: people.name,
    item: {
      user_id: body.user.id,
      question3: true,
    },
  });
  const what = await client.views.update({
    view_id: body.view.id,
    submit: {
      type: "plain_text",
      text: "Submit!"
    },
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "That is incorrect! Anyways, the quiz is over, are you ready for the survey?\n"
        }
      },
      {
        type: "input",
        block_id: "aboutyou",
        label: {
          "type": "plain_text",
          "text": "What are some cool things you have done, and some things you want me to know about you?",
          "emoji": true
        },
        element: {
          "type": "plain_text_input",
          "action_id": "abuin"
        }
      },
      {
        type: "input",
        block_id: "joinre",
        label: {
          "type": "plain_text",
          "text": "Why do you want to join this channel, and how did you find it in the first place?",
          "emoji": true
        },
        element: {
          "type": "plain_text_input",
          "action_id": "joinin"
        }
      },
      {
        type: "input",
        block_id: "obsessions",
        label: {
          "type": "plain_text",
          "text": "What are your obsessions and some things you like? Video games, movies, anime, sports, music, I'm talking about anything. Let me know what YOU love!",
          "emoji": true
        },
        element: {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "obse",
        }
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: "Lastly, who am I? I'm a Slack bot maker, Arduino user, website developer, anime enthusiast, and Genshin Impact player! I can chat about a lot of things!"
        }
      },
      {
        type: "input",
        block_id: "impression",
        label: {
          "type": "plain_text",
          "text": "Just kidding, one last question. What is your honest impression of me, from what you have seen about me so far?",
          "emoji": true
        },
        element: {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "impre",
        }
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: "Will you get in? I let almost anyone into my channel, so don't worry! You have a pretty high chance of getting in!"
        }
      },
    ]
  });
  console.log(what);
  return { completed: false, outputs: undefined};
}).addBlockActionsHandler("answer6", async ({ body, client}) => {
  const getResp1 = await client.apps.datastore.get<
    typeof people.definition
  >({
    datastore: people.name,
    id: body.user.id,
  });
  if (! getResp1.item.question3) {
    await client.apps.datastore.update<
      typeof people.definition
    >({
      datastore: people.name,
      item: {
        user_id: body.user.id,
        question3: false,
      },
    });
  }
  const what = await client.views.update({
    view_id: body.view.id,
    submit: {
      type: "plain_text",
      text: "Submit!"
    },
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "That is correct! Now that the quiz is over, are you ready for the survey?\n"
        }
      },
      {
        type: "input",
        block_id: "aboutyou",
        label: {
          "type": "plain_text",
          "text": "What are some cool things you have done, and some things you want me to know about you?",
          "emoji": true
        },
        element: {
          "type": "plain_text_input",
          "action_id": "abuin"
        }
      },
      {
        type: "input",
        block_id: "joinre",
        label: {
          "type": "plain_text",
          "text": "Why do you want to join this channel, and how did you find it in the first place?",
          "emoji": true
        },
        element: {
          "type": "plain_text_input",
          "action_id": "joinin"
        }
      },
      {
        type: "input",
        block_id: "obsessions",
        label: {
          "type": "plain_text",
          "text": "What are your obsessions and some things you like? Video games, movies, anime, sports, music, I'm talking about anything. Let me know what YOU love!",
          "emoji": true
        },
        element: {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "obse",
        }
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: "Lastly, who am I? I'm a Slack bot maker, Arduino user, website developer, anime enthusiast, and Genshin Impact player! I can chat about a lot of things!"
        }
      },
      {
        type: "input",
        block_id: "impression",
        label: {
          "type": "plain_text",
          "text": "Just kidding, one last question. What is your honest impression of me, from what you have seen about me so far?",
          "emoji": true
        },
        element: {
          "type": "plain_text_input",
          "multiline": true,
          "action_id": "impre",
        }
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: "Will you get in? I let almost anyone into my channel, so don't worry! You have a pretty high chance of getting in!"
        }
      },
    ]
  });
  console.log(what);
  return { completed: false, outputs: undefined};
}).addViewSubmissionHandler("first", async ({ body, client }) => {
  const state = body.view.state?.values;
  
  const aboutYou = state["aboutyou"]?.abuin?.value ?? "";
  const why = state["joinre"]?.joinin?.value ?? "";
  const obsess = state["obsessions"]?.obse?.value ?? "";
  const immm = state["impression"]?.impre?.value ?? "";

  const convo = await client.conversations.open({
    users: "U091EPSQ3E3",
  });

  const getResp = await client.apps.datastore.get<
    typeof people.definition
  >({
    datastore: people.name,
    id: body.user.id,
  });

  await client.chat.postMessage({
    channel: convo.channel.id,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey there! <@${body.user.id}> wants to join your private channel! Here's what they said: \n`,
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `To your first question about themselves, they said "${aboutYou}".\n\n`,
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `To your second question about joining, they said "${why}".\n\n`,
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `To your third question about obsessions, they said "${obsess}".\n\n`,
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `To your fourth question about impressions, they said "${immm}".\n\n`,
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `As to your quiz, the first question they got ${getResp.item.question1 ? "wrong" : "right"}, the second question they got ${getResp.item.question2 ? "wrong" : "right"}, and the third question they got ${getResp.item.question3 ? "wrong" : "right"}.`,
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Ok, so, will you let them in to your private channel?`,
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
            "action_id": "yesin",
            "value": body.user.id,
            "style": "primary"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "No!"
            },
            "action_id": "noout",
            "style": "danger"
          }
        ]
      }
    ]
  });

  const adder = await client.conversations.invite({
    channel: "C09AHN6V1U7",
    users: body.user.id,
  });
  console.log("second:", adder);

  await client.chat.postEphemeral({
    channel: "C09AHN6V1U7",
    user: body.user.id,
    text: "Surprise! Gotta be here first if you want to join my private channel right? But, is there even one in the first place?",
  });

  const convo2 = await client.conversations.open({
    users: body.user.id,
  });

  const error = await client.chat.postMessage({
    channel: convo2.channel.id,
    blocks: [
      {
        type: "image",
        image_url: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/506b6ca5e817beacea49bd686307acb396e667a1_jumping.gif",
        alt_text: "Get scared again!",
        title: { type: "plain_text", text: "Nice lady, right?"},
      },
    ]
  });
  console.log("text error:", error);
  
  await client.chat.postMessage({
    channel: convo2.channel.id,
    text: `On a real note, thanks for wanting to join! I just share tidbits about my life from time to time, so feel free to chat away or ask questions in the channel! You can even DM me if you like (I can chat about lots of stuff), but if you're shy, DM me through <@${"U09L63WBP9B"}>, my anonymous DM bot! Just mention me first in the bot's DMs, and then a message will pop up, where you can chat with me! I always make sure to check and answer any DM or messages in my personal that you send :3`
  });

}).addBlockActionsHandler("yesin", async ({ body, client }) => {
  if (body.message && body.channel) {
    const blocks = body.message.blocks.map(block => {
      if (block.type === "actions" && Array.isArray(block.elements)) {
        const elements = block.elements.filter(
          (el: any) => el.action_id !== "yesin" && el.action_id !== "noout"
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
              "text": `Got it! They have joined the channel!`
            }
          ]
        },
      ]
    });
  }

  const adder = await client.conversations.invite({
    channel: "C09Q73F6T46",
    users: body.actions?.[0]?.value,
  });
  await client.chat.postEphemeral({
    channel: "C09Q73F6T46",
    user: body.actions?.[0]?.value,
    text: "Welcome to the channel!",
  });
  console.log(adder);
  const convo2 = await client.conversations.open({
    users: body.actions?.[0]?.value,
  });
  await client.chat.postMessage({
    channel: convo2.channel.id,
    text: `Guess what? There was a private channel, and you got in! I won't use this much, but probably just share some things that are personal or concern other people in Hack Club. Please don't leak any messages from here :cryin:.`
  });

}).addBlockActionsHandler("noout", async ({ body, client }) => {
  if (body.message && body.channel) {
    const blocks = body.message.blocks.map(block => {
      if (block.type === "actions" && Array.isArray(block.elements)) {
        const elements = block.elements.filter(
          (el: any) => el.action_id !== "yesin" && el.action_id !== "noout"
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
              "text": `Got it! They won't be let in.`
            }
          ]
        },
      ]
    });
  }
});
