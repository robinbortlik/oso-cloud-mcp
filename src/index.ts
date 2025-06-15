import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { OsoClient } from "./oso-client.js";

// Define configuration schema to require configuration at connection time
export const configSchema = z.object({
  osoApiKey: z.string().describe("Oso Cloud API key"),
  osoApiUrl: z.string().default("https://cloud.osohq.com/api").describe("Oso Cloud API URL"),
});

export default function createStatelessServer({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) {
  const server = new McpServer({
    name: "OSO-Cloud-MCP",
    version: "0.0.2",
  });

  const osoClient = new OsoClient({
    apiKey: config.osoApiKey,
    apiUrl: config.osoApiUrl,
  });

  // Get policy
  server.tool(
    "get_policy",
    "Get the current Oso Cloud policy",
    {},
    async () => {
      const policy = await osoClient.getPolicy();
      return {
        content: [{ type: "text", text: JSON.stringify(policy, null, 2) }],
      };
    }
  );

  // Authorize
  server.tool(
    "authorize",
    "Check if an actor can perform an action on a resource",
    {
      actorType: z.string().describe("The type of actor (e.g., 'User', 'Organization')"),
      actorId: z.string().describe("The ID of the actor"),
      action: z.string().describe("The action to check"),
      resourceType: z.string().describe("The type of resource (e.g., 'Document', 'Project')"),
      resourceId: z.string().describe("The ID of the resource"),
      // contextFacts: z.array(z.any()).optional().describe("Additional context facts for authorization"),
    },
    async ({ actorType, actorId, action, resourceType, resourceId }) => {
      const result = await osoClient.authorize(actorType, actorId, action, resourceType, resourceId, []);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // List resources
  server.tool(
    "list_resources",
    "List resources of a specific type that an actor can perform an action on",
    {
      actorType: z.string().describe("The type of actor (e.g., 'User', 'Organization')"),
      actorId: z.string().describe("The ID of the actor"),
      action: z.string().describe("The action to check"),
      resourceType: z.string().describe("The type of resources to list"),
      // contextFacts: z.array(z.any()).optional().describe("Additional context facts for authorization"),
    },
    async ({ actorType, actorId, action, resourceType }) => {
      const result = await osoClient.list(
        actorType,
        actorId,
        action,
        resourceType,
        []
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Get actions
  server.tool(
    "get_actions",
    "Get all actions an actor can perform on a resource",
    {
      actorType: z.string().describe("The type of actor (e.g., 'User', 'Organization')"),
      actorId: z.string().describe("The ID of the actor"),
      resourceType: z.string().describe("The type of resource (e.g., 'Document', 'Project')"),
      resourceId: z.string().describe("The ID of the resource"),
      // contextFacts: z.array(z.any()).optional().describe("Additional context facts for authorization"),
    },
    async ({ actorType, actorId, resourceType, resourceId }) => {
      const result = await osoClient.getActions(
        actorType,
        actorId,
        resourceType,
        resourceId,
        []
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Authorize resources
  // server.tool(
  //   "authorize_resources",
  //   "Check which resources an actor can perform an action on",
  //   {
  //     actorType: z.string().describe("The type of actor (e.g., 'User', 'Organization')"),
  //     actorId: z.string().describe("The ID of the actor"),
  //     action: z.string().describe("The action to check"),
  //     resources: z.array(z.object({
  //       type: z.string().nullable().describe("The type of resource (e.g., 'Document', 'Project')"),
  //       id: z.string().nullable().describe("The ID of the resource")
  //     })).describe("List of resources to check"),
  //     // contextFacts: z.array(z.any()).optional().describe("Additional context facts for authorization"),
  //   },
  //   async ({ actorType, actorId, action, resources }) => {
  //     const result = await osoClient.authorizeResources(actorType, actorId, action, resources, []);
  //     return {
  //       content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  //     };
  //   }
  // );

  // Evaluate query
  // server.tool(
  //   "evaluate_query",
  //   "Evaluate a query against the Oso Cloud policy",
  //   {
  //     predicate: z.array(z.any()).describe("The predicate to evaluate"),
  //     calls: z.array(z.array(z.any())).describe("The calls to evaluate"),
  //     constraints: z.record(z.object({
  //       type: z.string(),
  //       ids: z.array(z.string())
  //     })).describe("Constraints for the query"),
  //     contextFacts: z.array(z.object({
  //       predicate: z.string(),
  //       args: z.array(z.object({
  //         type: z.string(),
  //         id: z.string()
  //       }))
  //     })).describe("Context facts for the query"),
  //   },
  //   async ({ predicate, calls, constraints, contextFacts }) => {
  //     const result = await osoClient.evaluateQuery(predicate, calls, constraints, contextFacts);
  //     return {
  //       content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  //     };
  //   }
  // );

  return server.server;
}
