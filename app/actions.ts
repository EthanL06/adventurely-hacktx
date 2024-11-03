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

// It will take in all tasks and generate a cohesive story line based on the tasks
export async function getStoryLine(name: string, { tasks }: { tasks: Task[] }) {
  // Filter out non-done tasks
  tasks = tasks.filter((task) => !task.done);

  const message = (task: Task) => {
    let msg = `Task Title: ${task.title}. Task Description: ${task.description}.`;

    if (task.subtasks) {
      task.subtasks.forEach((subtask) => {
        msg += `Subtask Title: ${subtask.title}. Subtask Description: ${subtask.description}.`;
      });
    }

    return msg;
  };

  const { object: storyLine } = (await generateObject({
    model: openai("gpt-3.5-turbo"),
    system:
      "Given a list of tasks, create an adventurous storyline where each task represents a unique challenge or mission the user must complete to progress. The place is called Adventurify. Weave the tasks into a cohesive plot, introducing each one as an exciting part of the journey. For example, studying might become 'gathering knowledge from ancient scrolls,' and exercising could be 'training to increase strength for an upcoming battle.' Maintain a narrative where each completed task brings the user closer to an ultimate goal, such as saving a kingdom, finding a lost artifact, or defeating a powerful enemy. Ensure the storyline reflects the theme of courage, growth, and perseverance, and provide a brief summary of how each task contributes to the story. You will also be given the user's name to personalize the storyline.",
    messages: [
      {
        role: "user",
        content: `User Name: ${name}.`,
      },
      ...tasks.map((task) => ({
        role: "user" as const,
        content: message(task),
      })),
    ],
    schema: z.object({
      storyLine: z.string().describe("The generated storyline."),
    }),
  })) as {
    object: {
      storyLine: string;
    };
  };

  return { storyLine };
}
