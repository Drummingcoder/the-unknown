import { Manifest } from "deno-slack-sdk/mod.ts";
import SampleWorkflow from "./workflows/onboarding.ts";
import SampleObjectDatastore from "./datastores/sample_datastore.ts";

export default Manifest({
  name: "The Box",
  description: "Just some fun tools to manage a channel!",
  icon: "assets/box.jpg",
  workflows: [SampleWorkflow],
  outgoingDomains: [],
  datastores: [SampleObjectDatastore],
  botScopes: ["commands","chat:write","chat:write.public","datastore:read","datastore:write",],
});
