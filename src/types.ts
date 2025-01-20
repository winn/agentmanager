export interface User {
  id: string;
  email: string;
}

export interface PromptHistory {
  id: string;
  agent_id: string;
  user_id: string;
  old_prompt?: string;
  new_prompt?: string;
  old_tools?: Tool[];
  new_tools?: Tool[];
  modified_at: string;
  type: 'prompt' | 'tools' | 'both';
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  openapi_spec: string;
}

export interface Agent {
  _id?: string; // MongoDB's ObjectId
  agent_id: string; // Our custom string ID
  name: string;
  system_prompt: string;
  tools: Tool[];
  created_by: string;
  created_at: string;
  updated_at: string;
}