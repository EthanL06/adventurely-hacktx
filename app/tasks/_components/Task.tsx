import React from "react";
import Container from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Task as TaskType } from "@/types/tasks";

type Props = {
  task: TaskType;
  open: boolean;
  setOpen: (open: boolean) => void;
  checked: boolean;
  setChecked: (checked: boolean) => void;
};

const Task = ({ task, open, setOpen, checked, setChecked }: Props) => {
  const dueDate = task.due_date ? new Date(task.due_date.toDate()) : new Date();

  let formattedDate = dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  formattedDate += ` at ${dueDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  return (
    <div className="flex w-full items-center gap-x-4">
      <div
        onClick={() => {
          setChecked(!checked);
        }}
      >
        <input
          className="nes-checkbox"
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <span></span>
      </div>

      <Container
        onClick={() => setOpen(!open)}
        className="retro-pointer flex grow items-center justify-between hover:bg-[#e7e7e7]"
      >
        <div className="flex flex-col gap-y-4">
          <h2 className="pointer-events-none truncate text-lg">{task.title}</h2>
          <p className="text-gray-500">{formattedDate}</p>
        </div>
        <svg
          className={cn("transform transition-transform", {
            "rotate-[270deg]": open,
            "rotate-90": !open,
          })}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Container>
    </div>
  );
};

export default Task;
