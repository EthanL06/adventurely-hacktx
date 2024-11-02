"use client";

import React, { Fragment, useState } from "react";
import { TaskType } from "@/types";
import Task from "./Task";
import Subtask from "./Subtask";
import { cn } from "@/lib/utils";
type Props = {
  date: "Overdue" | "Today" | string;
  tasks: TaskType[];
};

const TaskGroup = ({ date, tasks }: Props) => {
  return (
    <div>
      <h2
        className={cn(
          "mb-4 text-xl",
          date === "Today" && "text-[#85B6F2]",
          date === "Overdue" && "text-red-500",
        )}
      >
        {date}...
      </h2>
      <div className={cn("flex flex-col gap-4")}>
        {tasks.map((task) => (
          <TaskInnerGroup key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

const TaskInnerGroup = ({ task }: { task: TaskType }) => {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <div
      className={cn([
        "space-y-4",
        {
          "text-gray-500 line-through": checked,
        },
      ])}
    >
      <Task
        open={open}
        setOpen={setOpen}
        checked={checked}
        setChecked={setChecked}
        key={task.id}
        task={task}
      />

      <div className="ml-24 flex flex-col gap-4">
        {open &&
          task.subtasks.map((subtask) => (
            <Subtask
              key={subtask.title}
              subtask={subtask}
              allComplete={checked}
            />
          ))}
      </div>
    </div>
  );
};

export default TaskGroup;
