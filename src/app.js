const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const repository = repositories.find((repo) => repo.id === id);
  const { url, title, techs } = request.body;

  if (!repository) {
    return response.status(400).json("Repository not found");
  }

  Object.assign(repository, {
    url,
    title,
    techs,
  });

  const newArray = repositories.filter((repo) => repo.id !== id);
  newArray.push(repository);

  repositories = newArray;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response.status(400).json("Repository not found");
  }

  repositories = repositories.filter((repo) => repo.id !== id);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id;
  const repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response.status(400).json("Repository not found");
  }

  Object.assign(repository, {
    likes: repository.likes + 1,
  });

  const newArray = repositories.filter((repo) => repo.id !== id);
  newArray.push(repository);

  repositories = newArray;

  return response.json(repository);
});

module.exports = app;
