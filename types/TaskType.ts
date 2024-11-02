export type Task = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  subtasks: {
    title: string;
    description: string;
  }[];
};
