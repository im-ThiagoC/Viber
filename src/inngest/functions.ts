import { openai, createAgent } from "@inngest/agent-kit";

import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    // Create a new agent with a system prompt (you can add optional tools, too)
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert Next.JS developer. You write readable, maintainable code. You write simple Next.js & React snippets",
      model: openai({ model: "gpt-4o-mini" }),
    });

		const { output } = await codeAgent.run(
			`Write the following snippet: ${event.data.value}`,
		);
		console.log(output);

    // Imagine this is a long-running task
    //await step.sleep("wait-a-moment", "5s");

    return { output };
  },
);