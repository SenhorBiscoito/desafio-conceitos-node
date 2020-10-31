const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid, v4 } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project id" });
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: v4(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).send("Bad Request");
  }

  const repository = { id, title, url, techs };

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    repository,
  };

  if (likes >= 0) {
    return response.json({ likes: repositories[repositoryIndex].likes });
  }

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).send("Bad Request");
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(400).send("Bad Request");
  }

  repository.likes += 1;

  return response.json({ likes: repository.likes });
});

module.exports = app;
