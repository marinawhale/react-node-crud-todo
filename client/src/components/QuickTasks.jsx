import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Circle, Plus } from 'lucide-react';
import './QuickTasks.css';

const API_URL = 'http://localhost:5000/quick-tasks';

export const QuickTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState('');

    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            const sortedTasks = response.data.sort((a, b) => a.order - b.order);
            setTasks(sortedTasks);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;

        try {
            const response = await axios.post(API_URL, { text: newTaskText });
            setTasks([...tasks, response.data]);
            setNewTaskText('');
        } catch (error) {
            console.error("Erro ao adicionar:", error);
        }
    };

    const toggleTask = async (task) => {
        try {
            const updatedTask = { ...task, completed: !task.completed };

            await axios.put(`${API_URL}/${task.id}`, updatedTask);
            
            setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
        } catch (error) {
            console.error("Erro ao atualizar:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    return (
        <div className="quick-tasks-container">
            <h2>Quick Tasks</h2>
            
            <form onSubmit={handleAddTask} className="quick-task-input-area">
                <input 
                    type="text" 
                    placeholder="O que precisa ser feito?"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                />
                <button type="submit"><Plus size={20} /></button>
            </form>

            <div className="quick-tasks-list">
                {tasks.map((task) => (
                    <div key={task.id} className={`quick-task-item ${task.completed ? 'completed' : ''}`}>
                        <div className="quick-task-content" onClick={() => toggleTask(task)}>
                            {task.completed ? <CheckCircle className="quick-icon-check" /> : <Circle className="quick-icon-uncheck" />}
                            <span>{task.text}</span>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="btn-delete">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};