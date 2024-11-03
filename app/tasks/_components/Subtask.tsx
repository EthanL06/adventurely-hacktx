import React, { useState } from "react";

import Container from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { Task } from "@/types/tasks";
type Props = {
  subtask: NonNullable<Task["subtasks"]>[0];
  allComplete: boolean;
};

const Subtask = ({ subtask, allComplete }: Props) => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-x-4">
      {!allComplete && (
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
      )}

      <Container
        className={cn(
          "retro-pointer flex grow items-center justify-between hover:bg-[#e7e7e7]",
          {
            "text-gray-500 line-through": checked || allComplete,
          },
        )}
      >
        <h2 className="pointer-events-none truncate text-lg">
          {subtask.title}
        </h2>
      </Container>
    </div>
  );
};

export default Subtask;
