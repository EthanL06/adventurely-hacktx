"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Task } from "@/types/tasks";

export async function getStats({
  title,
  description,
}: Pick<Task, "title" | "description">) {
  const { object: stats } = (await generateObject({
    model: openai("gpt-3.5-turbo"),
    system:
      "Assign rewards for the four stats—HP, XP, Strength, and Intelligence—based on the task’s nature and difficulty. For HP (self-care tasks): light +1-2, moderate +2-3, intense +3-5. For XP (all tasks): simple +1-3, moderate +3-5, challenging +5-10. For Strength (physical tasks): light +1-2, moderate +2-4, intense +4-6. For Intelligence (mental tasks): light +1-2, moderate +2-4, intense +4-6. Adjust each stat to reflect task difficulty, and provide a summary of stats gained",
    messages: [
      {
        role: "user",
        content: `Task Title: ${title}. Task Description: ${description}`,
      },
    ],
    schema: z.object({
      stats: z.object({
        HP: z.number().describe("The amount of HP gained."),
        XP: z.number().describe("The amount of XP gained."),
        Strength: z.number().describe("The amount of Strength gained."),
        Intelligence: z.number().describe("The amount of Intelligence gained."),
      }),
    }),
  })) as {
    object: {
      stats: { HP: number; XP: number; Strength: number; Intelligence: number };
    };
  };

  return { stats };
}

export async function getSubtasks({
  title,
  description,
}: Pick<Task, "title" | "description">) {
  const { object: subtasks } = (await generateObject({
    model: openai("gpt-3.5-turbo"),
    system:
      "Generate a list of subtasks for the main task. The subtasks should be related to the main task and should help in completing it. The subtasks should be specific and actionable. The subtasks should be organized in a logical order.",
    messages: [
      {
        role: "user",
        content: `Task Title: ${title}. Task Description: ${description}`,
      },
    ],
    schema: z.object({
      subtasks: z
        .array(
          z.object({
            title: z.string().describe("The title of the subtask."),
            description: z.string().describe("The description of the subtask."),
            done: z.boolean().default(false),
          }),
        )
        .describe("The list of subtasks."),
    }),
  })) as {
    object: {
      subtasks: Task["subtasks"];
    };
  };

  return { subtasks };
}
