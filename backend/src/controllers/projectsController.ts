import { Request, Response } from "express";

export const getProjects = (req: Request, res: Response) => {
  const projects = [
    { id: 1, title: "Project One", description: "This is project one." },
    { id: 2, title: "Project Two", description: "This is project two." },
    { id: 3, title: "Project Three", description: "This is project three." },
  ];
  res.json(projects);
};
