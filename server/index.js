const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

const readData = () => {
    try {
        if (!fs.existsSync(DB_FILE)) return { quickTasks: [], tasks: [] };
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(data || '{"quickTasks":[], "tasks":[]}');
        if (!parsed.quickTasks) parsed.quickTasks = [];
        if (!parsed.tasks) parsed.tasks = [];
        return parsed;
    } catch (error) {
        return { quickTasks: [], tasks: [] };
    }
};

const writeData = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

app.get('/tasks', (req, res) => {
    const data = readData();
    res.json(data.tasks);
});

app.post('/tasks', (req, res) => {
    const { title, description, deadline, completed, image, priority } = req.body;
    const data = readData();
    const newTask = { 
        id: uuidv4(), title, description, deadline, image, priority, 
        completed: false, createdAt: new Date().toISOString() 
    };
    data.tasks.push(newTask);
    writeData(data);
    res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    let data = readData();
    data.tasks = data.tasks.filter(t => t.id !== id);
    writeData(data);
    res.status(204).send();
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, deadline, image, priority, completed } = req.body;
    let data = readData();
    const index = data.tasks.findIndex(t => t.id === id);

    if (index !== -1) {
        data.tasks[index] = { ...data.tasks[index], title, description, deadline, image, priority, completed };
        writeData(data);
        res.json(data.tasks[index]);
    } else {
        res.status(404).send('Tarefa não encontrada');
    }
});

app.get('/quick-tasks', (req, res) => {
    const data = readData();
    res.json(data.quickTasks);
});

app.post('/quick-tasks', (req, res) => {
    const { text } = req.body;
    const data = readData();
    const newTask = { id: uuidv4(), text, completed: false };
    data.quickTasks.push(newTask);
    writeData(data);
    res.status(201).json(newTask);
});

app.delete('/quick-tasks/:id', (req, res) => {
    const { id } = req.params;
    let data = readData();
    data.quickTasks = data.quickTasks.filter(t => t.id !== id);
    writeData(data);
    res.status(204).send();
});

app.put('/quick-tasks/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    let data = readData();
    const index = data.quickTasks.findIndex(t => t.id === id);

    if (index !== -1) {
        data.quickTasks[index] = { ...data.quickTasks[index], text, completed };
        writeData(data);
        res.json(data.quickTasks[index]);
    } else {
        res.status(404).send('Tarefa não encontrada');
    }
});

if (!fs.existsSync(DB_FILE)) {
    writeData({ quickTasks: [], tasks: [] });
}

app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));