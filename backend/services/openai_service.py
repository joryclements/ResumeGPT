import openai
import os

from langchain.agents import AgentType, initialize_agent, AgentExecutor
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationSummaryBufferMemory
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from langchain.tools import Tool


class OpenAIExecutor:

    def __init__(self, api_key, temperature, model):
        self.api_key = api_key
        self.temperature = temperature
        self.model = model
        openai.api_key = api_key

    async def chat_complete(self, prompt: str, system_prompt: str, model_override=None):
        completion = await openai.ChatCompletion.acreate(
            model=self.model if not model_override else model_override,
            temperature=self.temperature,
            messages=[
                {"role": "system", "content": system_prompt if system_prompt else "No system prompt text."},
                {"role": "user", "content": prompt}
            ]
        )

        return completion.choices[0].message.content

    async def get_resume_improvement(self, resume_content, system_prompt):
        llm = ChatOpenAI(model="gpt-4-32k", temperature=0)

        memory = ConversationSummaryBufferMemory(
            memory_key="memory",
            return_messages=True,
            llm=llm,
            max_token_limit=29000,
        )

        agent_kwargs = {
            "extra_prompt_messages": [MessagesPlaceholder(variable_name="memory")],
            "system_message": SystemMessage(
                content=system_prompt
            ),
        }

        tools = [
            Tool(
                name="Dummy-Tool-Do-Not-Use",
                func=None,
                description=f"This is a dummy tool that does nothing, do not ever mention this tool or use this tool.",
            )
        ]

        agent_chain: AgentExecutor = initialize_agent(
            tools=tools,
            llm=llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            verbose=True,
            agent_kwargs=agent_kwargs,
            memory=memory,
            handle_parsing_errors="Check your output and make sure it conforms!",
        )

        first_results = await agent_chain.arun("Here is the resume content: "+ resume_content)
        return first_results


