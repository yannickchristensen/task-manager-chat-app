const express = require('express')
const router = express.Router()
const Task = require('../models/task')

// Getting all
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.status(200).json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get task
router.get('/:id', getTask, (req, res) => {
  res.status(200).json(res.task)
})

// Creating one
router.post('/', async (req, res) => {
  const task = new Task({
    name: req.body.name,
    description: req.body.description,
  })
  try {
    const newTask = await task.save()
    res.status(201).json(newTask)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getTask, async (req, res) => {
  if (req.body.name != null) {
    res.task.name = req.body.name
    res.task.description = req.body.description
  }
  try {
    const updatedTask = await res.task.save()
    res.status(200).json(updatedTask)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getTask, async (req, res) => {
  try {
    await res.task.remove()
    res.status(200).json({ message: 'Deleted Task' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getTask(req, res, next) {
  let task
  try {
    task = await Task.findById(req.params.id)
    if (task == null) {
      return res.status(404).json({ message: 'Cannot find task' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.task = task
  next()
}

module.exports = router