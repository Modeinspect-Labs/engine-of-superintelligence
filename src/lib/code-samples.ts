import type { ChatParams, Model } from "./types";

const API = "https://inference.api.nscale.com/v1";

/** cURL / Python / JavaScript snippets for a model's endpoint. */
export function modelSamples(model: Model) {
  const vision = model.type === "Image-Text-to-Text";
  const embed = model.type === "Embeddings";
  const image = model.type === "Text-to-Image";
  if (embed) {
    const body = `{\n    "model": "${model.id}",\n    "input": "The quick brown fox jumps over the lazy dog"\n  }`;
    return [
      {
        id: "curl",
        label: "cURL",
        code: `curl ${API}/embeddings \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer $NSCALE_SERVICE_TOKEN" \\\n  -X POST \\\n  -d '${body}'`,
      },
      {
        id: "python",
        label: "Python",
        code: `from openai import OpenAI\n\nclient = OpenAI(\n    base_url="${API}",\n    api_key=os.environ["NSCALE_SERVICE_TOKEN"],\n)\n\nresponse = client.embeddings.create(\n    model="${model.id}",\n    input="The quick brown fox jumps over the lazy dog",\n)\nprint(response.data[0].embedding[:8])`,
      },
      {
        id: "javascript",
        label: "JavaScript",
        code: `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  baseURL: "${API}",\n  apiKey: process.env.NSCALE_SERVICE_TOKEN,\n});\n\nconst response = await client.embeddings.create({\n  model: "${model.id}",\n  input: "The quick brown fox jumps over the lazy dog",\n});\nconsole.log(response.data[0].embedding.slice(0, 8));`,
      },
    ];
  }
  if (image) {
    return [
      {
        id: "curl",
        label: "cURL",
        code: `curl ${API}/images/generations \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer $NSCALE_SERVICE_TOKEN" \\\n  -X POST \\\n  -d '{\n    "model": "${model.id}",\n    "prompt": "A fjord data centre at dawn, photoreal",\n    "size": "1024x1024",\n    "n": 1\n  }'`,
      },
      {
        id: "python",
        label: "Python",
        code: `from openai import OpenAI\n\nclient = OpenAI(\n    base_url="${API}",\n    api_key=os.environ["NSCALE_SERVICE_TOKEN"],\n)\n\nimage = client.images.generate(\n    model="${model.id}",\n    prompt="A fjord data centre at dawn, photoreal",\n    size="1024x1024",\n)\nprint(image.data[0].url)`,
      },
      {
        id: "javascript",
        label: "JavaScript",
        code: `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  baseURL: "${API}",\n  apiKey: process.env.NSCALE_SERVICE_TOKEN,\n});\n\nconst image = await client.images.generate({\n  model: "${model.id}",\n  prompt: "A fjord data centre at dawn, photoreal",\n  size: "1024x1024",\n});\nconsole.log(image.data[0].url);`,
      },
    ];
  }
  const curlMessages = vision
    ? `"messages": [{\n      "role": "user",\n      "content": [\n        {"type": "text", "text": "What is in this image?"},\n        {\n          "type": "image_url",\n          "image_url": {\n            "url": "https://s3.glo1.nscale.com/inference/vision-example.jpg"\n          }\n        }\n      ]\n    }]`
    : `"messages": [{\n      "role": "user",\n      "content": "What is the capital of France?"\n    }]`;
  const pyMessages = vision
    ? `messages=[{\n        "role": "user",\n        "content": [\n            {"type": "text", "text": "What is in this image?"},\n            {"type": "image_url", "image_url": {"url": "https://s3.glo1.nscale.com/inference/vision-example.jpg"}},\n        ],\n    }],`
    : `messages=[{"role": "user", "content": "What is the capital of France?"}],`;
  const jsMessages = vision
    ? `messages: [{\n    role: "user",\n    content: [\n      { type: "text", text: "What is in this image?" },\n      { type: "image_url", image_url: { url: "https://s3.glo1.nscale.com/inference/vision-example.jpg" } },\n    ],\n  }],`
    : `messages: [{ role: "user", content: "What is the capital of France?" }],`;
  return [
    {
      id: "curl",
      label: "cURL",
      code: `curl ${API}/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer $NSCALE_SERVICE_TOKEN" \\\n  -X POST \\\n  -d '{\n    "model": "${model.id}",\n    ${curlMessages}\n  }'`,
    },
    {
      id: "python",
      label: "Python",
      code: `from openai import OpenAI\n\nclient = OpenAI(\n    base_url="${API}",\n    api_key=os.environ["NSCALE_SERVICE_TOKEN"],\n)\n\ncompletion = client.chat.completions.create(\n    model="${model.id}",\n    ${pyMessages}\n)\nprint(completion.choices[0].message.content)`,
    },
    {
      id: "javascript",
      label: "JavaScript",
      code: `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  baseURL: "${API}",\n  apiKey: process.env.NSCALE_SERVICE_TOKEN,\n});\n\nconst completion = await client.chat.completions.create({\n  model: "${model.id}",\n  ${jsMessages}\n});\nconsole.log(completion.choices[0].message.content);`,
    },
  ];
}

/** The Workbench's "View code": current model, system prompt and parameters. */
export function workbenchSamples(
  model: Model,
  system: string,
  params: ChatParams,
  lastUser: string,
) {
  const sys = JSON.stringify(system);
  const user = JSON.stringify(lastUser || "Hello!");
  return [
    {
      id: "curl",
      label: "cURL",
      code: `curl --request POST \\\n  --url ${API}/chat/completions \\\n  --header "Authorization: Bearer $NSCALE_SERVICE_TOKEN" \\\n  --header "Content-Type: application/json; charset=utf-8" \\\n  --data '{\n  "frequency_penalty": ${params.frequencyPenalty},\n  "max_tokens": ${params.maxTokens},\n  "messages": [\n    {\n      "content": ${sys},\n      "role": "system"\n    },\n    {\n      "content": ${user},\n      "role": "user"\n    }\n  ],\n  "model": "${model.id}",\n  "presence_penalty": ${params.presencePenalty},\n  "temperature": ${params.temperature},\n  "top_p": ${params.topP}\n}'`,
    },
    {
      id: "python",
      label: "Python",
      code: `from openai import OpenAI\n\nclient = OpenAI(\n    base_url="${API}",\n    api_key=os.environ["NSCALE_SERVICE_TOKEN"],\n)\n\ncompletion = client.chat.completions.create(\n    model="${model.id}",\n    messages=[\n        {"role": "system", "content": ${sys}},\n        {"role": "user", "content": ${user}},\n    ],\n    temperature=${params.temperature},\n    top_p=${params.topP},\n    max_tokens=${params.maxTokens},\n    presence_penalty=${params.presencePenalty},\n    frequency_penalty=${params.frequencyPenalty},\n)\nprint(completion.choices[0].message.content)`,
    },
    {
      id: "javascript",
      label: "JavaScript",
      code: `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  baseURL: "${API}",\n  apiKey: process.env.NSCALE_SERVICE_TOKEN,\n});\n\nconst completion = await client.chat.completions.create({\n  model: "${model.id}",\n  messages: [\n    { role: "system", content: ${sys} },\n    { role: "user", content: ${user} },\n  ],\n  temperature: ${params.temperature},\n  top_p: ${params.topP},\n  max_tokens: ${params.maxTokens},\n  presence_penalty: ${params.presencePenalty},\n  frequency_penalty: ${params.frequencyPenalty},\n});\nconsole.log(completion.choices[0].message.content);`,
    },
  ];
}
