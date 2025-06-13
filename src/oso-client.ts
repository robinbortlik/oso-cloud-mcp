import axios from 'axios';
import { z } from 'zod';

export const osoConfigSchema = z.object({
  apiKey: z.string().describe("Oso Cloud API key"),
  apiUrl: z.string().default("https://cloud.osohq.com/api").describe("Oso Cloud API URL"),
});

export type OsoConfig = z.infer<typeof osoConfigSchema>;

export class OsoClient {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(config: OsoConfig) {
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async getPolicy() {
    const response = await axios.get(`${this.apiUrl}/policy`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async authorize(actorType: string, actorId: string, action: string, resourceType: string, resourceId: string, contextFacts: any[] = []) {
    const response = await axios.post(`${this.apiUrl}/authorize`, {
      actor_type: actorType,
      actor_id: actorId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      context_facts: contextFacts
    }, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async authorizeResources(actorType: string, actorId: string, action: string, resources: Array<{ type: string | null, id: string | null }>, contextFacts: any[] = []) {
    const response = await axios.post(`${this.apiUrl}/authorize_resources`, {
      actor_type: actorType,
      actor_id: actorId,
      action,
      resources,
      context_facts: contextFacts
    }, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async list(actorType: string, actorId: string, action: string, resourceType: string, contextFacts: any[] = []) {
    const response = await axios.post(`${this.apiUrl}/list`, {
      actor_type: actorType,
      actor_id: actorId,
      action,
      resource_type: resourceType,
      context_facts: contextFacts
    }, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getActions(actorType: string, actorId: string, resourceType: string, resourceId: string, contextFacts: any[] = []) {
    const response = await axios.post(`${this.apiUrl}/actions`, {
      actor_type: actorType,
      actor_id: actorId,
      resource_type: resourceType,
      resource_id: resourceId,
      context_facts: contextFacts
    }, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async evaluateQuery(predicate: any[], calls: any[][], constraints: Record<string, { type: string, ids: string[] }>, contextFacts: Array<{ predicate: string, args: Array<{ type: string, id: string }> }>) {
    const response = await axios.post(`${this.apiUrl}/evaluate_query`, {
      predicate,
      calls,
      constraints,
      context_facts: contextFacts
    }, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
} 