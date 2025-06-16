# OSO Cloud MCP

A Model Context Protocol (MCP) server that integrates with OSO Cloud to provide authorization capabilities. This server acts as a bridge between your application and OSO Cloud's authorization service, allowing you to perform various authorization checks and queries through a standardized interface.


## Supported Tools

The server provides the following tools:

1. **get_policy**
   - Retrieves the current OSO Cloud policy
   - Returns the policy as a JSON string

2. **authorize**
   - Checks if an actor can perform a specific action on a resource
   - Parameters:
     - `actorType`: Type of actor (e.g., 'User', 'Organization')
     - `actorId`: ID of the actor
     - `action`: Action to check
     - `resourceType`: Type of resource (e.g., 'Document', 'Project')
     - `resourceId`: ID of the resource

3. **list_resources**
   - Lists resources of a specific type that an actor can perform an action on
   - Parameters:
     - `actorType`: Type of actor
     - `actorId`: ID of the actor
     - `action`: Action to check
     - `resourceType`: Type of resources to list

4. **get_actions**
   - Gets all actions an actor can perform on a resource
   - Parameters:
     - `actorType`: Type of actor
     - `actorId`: ID of the actor
     - `resourceType`: Type of resource
     - `resourceId`: ID of the resource

## Configuration

To use this server, you need to provide the following configuration:

```typescript
{
  osoApiKey: string;    // OSO Cloud API key
  osoApiUrl: string;    // OSO Cloud API URL (defaults to "https://cloud.osohq.com/api")
}
```

## Smithery Integration

This project is available on Smithery at: https://smithery.ai/server/@robinbortlik/oso-cloud-mcp

## Development

To run the project locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```