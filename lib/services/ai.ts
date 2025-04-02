import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

interface DocumentationInput {
  name: string;
  description: string;
  endpoints: any; // Keep it generic to handle raw JSON
}

export async function generateDocumentation(input: DocumentationInput): Promise<string> {
  try {
    if (!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY) {
      throw new Error("Hugging Face API key is missing. Check your environment variables.");
    }

    const prompt = `
# ${input.name} API Documentation

**Description:**  
${input.description}

---

## Overview
This document provides a detailed overview of the API endpoints available in the **${input.name}** project. Each endpoint is explained with its purpose, request structure, and response format. The raw JSON input is also included for reference.

---

## API Endpoints

Below is the raw JSON representation of the API endpoints:

\`\`\`json
${JSON.stringify(input.endpoints, null, 2)}
\`\`\`

---

## Explanation of Endpoints

For each endpoint, the following details are provided:
- **Method**: The HTTP method (e.g., GET, POST, PUT, DELETE).
- **Path**: The URL path for the endpoint.
- **Description**: A brief explanation of the endpoint's purpose.
- **Request Schema**: The structure of the request payload (if applicable).
- **Response Schema**: The structure of the response payload.

---

## Example Usage

Here is an example of how to use the API:

\`\`\`bash
# Example cURL request
curl -X POST https://api.example.com/endpoint \
  -H "Content-Type: application/json" \
  -d '{
    "key": "value"
  }'
\`\`\`

---

## Notes
- Ensure that you have the proper authentication headers when making requests.
- Refer to the raw JSON input above for additional details about the API structure.

---

## Conclusion
This documentation was generated using AI and provides a comprehensive overview of the API. For further details, refer to the raw JSON input or contact the development team.
`;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 4000,
        temperature: 0.7,
        top_p: 0.95,
      },
    });

    if (!response?.generated_text) {
      throw new Error("No documentation was generated. The AI response was empty.");
    }

    return response.generated_text;
  } catch (error: any) {
    console.error("Error generating documentation:", error);
    if (error.message.includes("Invalid credentials")) {
      throw new Error("Invalid Hugging Face API key. Please check your configuration.");
    }
    throw new Error(`Failed to generate documentation: ${error.message}`);
  }
}