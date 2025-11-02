import { Manifest } from "deno-slack-sdk/mod.ts";
import joining from "./workflows/onboarding.ts";
import people from "./datastores/results.ts";

export default Manifest({
  name: "Thingy",
  description: "Just some fun tools to manage a channel!",
  icon: "assets/box.jpg",
  workflows: [joining],
  outgoingDomains: [],
  datastores: [people],
  botScopes: ["channels:write.invites", "groups:write.invites", "channels:manage", "groups:write", "im:write", "mpim:write", "commands","chat:write","chat:write.public","datastore:read","datastore:write",],
});
