import { Manifest } from "deno-slack-sdk/mod.ts";
import joining from "./workflows/onboarding.ts";
import people from "./datastores/results.ts";

export default Manifest({
  name: "The Box",
  description: "Just some fun tools to manage a channel!",
  icon: "assets/box.jpg",
  workflows: [joining],
  outgoingDomains: [],
  datastores: [people],
  botScopes: ["chat:write", "channels:manage", "channels:write.invites", "groups:write", "groups:write.invites", "im:write", "mpim:write", "channels:manage", "groups:write", "im:write", "mpim:write", "commands","chat:write","chat:write.public","datastore:read","datastore:write",],
});
