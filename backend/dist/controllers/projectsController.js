"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = void 0;
const getProjects = (req, res) => {
    const projects = [
        { id: 1, title: "Project One", description: "This is project one." },
        { id: 2, title: "Project Two", description: "This is project two." },
        { id: 3, title: "Project Three", description: "This is project three." },
    ];
    res.json(projects);
};
exports.getProjects = getProjects;
