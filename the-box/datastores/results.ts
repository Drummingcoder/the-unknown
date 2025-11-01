import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const people = DefineDatastore({
  name: "thepeople",
  primary_key: "user_id",
  attributes: {
    user_id: {
      type: Schema.slack.types.user_id,
    },
    question1: {
      type: Schema.types.boolean,
    },
    question2: {
      type: Schema.types.boolean,
    },
    question3: {
      type: Schema.types.boolean,
    },
  },
});

export default people;
