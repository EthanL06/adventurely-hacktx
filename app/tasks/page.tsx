import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import React from "react";
import TaskGroup from "./_components/TaskGroup";
import { TaskType } from "@/types";

type Props = {};

const Page = (props: Props) => {
  const testData = [
    {
      id: 1,
      title: "Website Redesign Project",
      description:
        "Redesign the company website to improve user experience and modernize the interface. This includes updating the visual style, reorganizing content, and ensuring mobile compatibility.",
      due_date: "11/1/2024",
      subtasks: [
        {
          title: "Research user preferences",
          description:
            "Conduct surveys and analyze user feedback to identify key pain points in the current design.",
        },
        {
          title: "Create initial wireframes",
          description:
            "Develop wireframes to outline the updated layout and content structure.",
        },
      ],
    },
    {
      id: 2,
      title: "Q4 Marketing Campaign",
      description:
        "Plan and execute a targeted marketing campaign to increase engagement and sales during the holiday season. Focus on social media, email marketing, and influencer collaborations.",
      due_date: "11/30/2024",
      subtasks: [
        {
          title: "Identify key influencers",
          description:
            "Compile a list of influencers who align with the brand and reach out for collaboration.",
        },
        {
          title: "Develop social media content",
          description:
            "Create engaging posts, stories, and ads for the campaign, ensuring consistency with the brand message.",
        },
      ],
    },
    {
      id: 3,
      title: "End-of-Year Financial Reporting",
      description:
        "Prepare financial statements and reports for the fiscal year. Ensure all records are accurate and aligned with auditing standards.",
      due_date: "12/10/2024",
      subtasks: [
        {
          title: "Compile financial data",
          description:
            "Gather and organize all relevant financial records from the year.",
        },
        {
          title: "Review and audit data",
          description:
            "Conduct an internal review to ensure accuracy and compliance with regulations.",
        },
      ],
    },
    {
      id: 4,
      title: "Product Launch - New Software Update",
      description:
        "Coordinate the release of the latest software update, including testing, documentation, and marketing to reach existing and potential users.",
      due_date: "12/20/2024",
      subtasks: [
        {
          title: "Run final quality assurance tests",
          description:
            "Test the software to ensure all features work as expected and identify any last-minute bugs.",
        },
        {
          title: "Prepare user documentation",
          description:
            "Update the user manual and release notes to reflect the new features and fixes.",
        },
      ],
    },
    {
      id: 5,
      title: "Annual Employee Performance Review",
      description:
        "Conduct performance reviews for all employees to evaluate their contributions over the past year and discuss goals for the upcoming year.",
      due_date: "1/05/2025",
      subtasks: [
        {
          title: "Collect feedback from team leads",
          description:
            "Reach out to team leads for feedback on their team members' performance and growth.",
        },
        {
          title: "Schedule review meetings",
          description:
            "Coordinate with each employee to schedule a one-on-one review session.",
        },
      ],
    },
    {
      id: 6,
      title: "Update Internal Training Materials",
      description:
        "Refresh training materials to reflect recent changes in company policies, tools, and processes.",
      due_date: "1/15/2025",
      subtasks: [
        {
          title: "Revise onboarding documents",
          description:
            "Update onboarding guides with the latest policies and tool instructions.",
        },
        {
          title: "Create training videos",
          description:
            "Record new training videos demonstrating updated processes.",
        },
      ],
    },
    {
      id: 7,
      title: "Client Satisfaction Survey",
      description:
        "Conduct an annual survey to gather feedback from clients regarding their satisfaction and identify areas for improvement.",
      due_date: "1/25/2025",
      subtasks: [
        {
          title: "Draft survey questions",
          description:
            "Prepare a list of questions focused on various aspects of client satisfaction.",
        },
        {
          title: "Send survey to clients",
          description: "Distribute the survey via email to all active clients.",
        },
      ],
    },
  ] as TaskType[];

  const formatRelativeDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return "This Week";
    if (diffDays < 14) return "Next Week";
    return "Later";
  };

  const groupTasksByDate = (tasks: TaskType[]) => {
    return tasks.reduce(
      (groups, task) => {
        const dateCategory = formatRelativeDate(task.due_date);
        if (!groups[dateCategory]) groups[dateCategory] = [];
        groups[dateCategory].push(task);
        return groups;
      },
      {} as Record<string, TaskType[]>,
    );
  };

  const groupedTasks = groupTasksByDate(testData);

  // Sort the tasks in each group by due date
  Object.keys(groupedTasks).forEach((date) => {
    groupedTasks[date].sort((a, b) => {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  });

  return (
    <div className="p-12">
      <Container>
        <div className="flex justify-between">
          <h1 className="text-3xl">Your Tasks</h1>
          <Button className="flex items-center" size={"xs"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <div>Add Task</div>
          </Button>
        </div>

        <div className="mt-8 flex flex-col gap-y-12">
          {Object.keys(groupedTasks).map((date) => (
            <TaskGroup key={date} date={date} tasks={groupedTasks[date]} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Page;
