const express = require('express')

const server = express();
server.use(express.json());


const projects = []
let totalReq = 0

function validateProject(req, res, next){
  const { id, title } = req.body 
  
  if(req.method === 'POST' && !id){
    return res.status(400).json({ error: 'Project id is required'})
  }
  
  if(!title){
    return res.status(400).json({ error: 'Project title is required'})
  }

  req.project = { id, title, tasks:[]};

  return next();
}

function validateTask(req,res,next){
  if(!req.body.title){
    return res.status(400).json({ error: 'Task title is required'})
  }

  return next();
}

function projectExists(req,res,next){
  const { id } = req.params

  const project = projects.find((p) => p.id == id)

  if(!project){
    return res.status(404).json({ error: 'Project does not exists'})
  }

  return next()
}

function requestLogger(req, res, next){
  
  totalReq++;
  console.log(`Número de requisições: ${totalReq}`)

  return next()
}

server.use(requestLogger)

server.post('/projects', validateProject, (req, res) => {
  projects.push(req.project);
  return res.json(projects)
})

server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.put('/projects/:id', projectExists, validateProject, (req, res) => {
  const { id } = req.params
  const project = projects.find((p) => p.id === id)

  project.title = req.body.title

  return res.json(projects)
})

server.delete('/projects/:id', projectExists, (req,res) => {
  const { id } = req.params
  const projectIndex = projects.findIndex((p) => p.id === id)

  projects.slice(projectIndex, 1)

  return res.send()
})


server.post('/projects/:id/tasks', projectExists, validateTask, (req,res) => {
  const { id } = req.params

  const project = projects.find((p) => p.id === id)

  project.tasks.push(req.body.title)

  return res.json(project)
})



server.listen(3000);