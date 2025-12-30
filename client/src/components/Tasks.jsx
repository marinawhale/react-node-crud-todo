import './Tasks.css';
import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks';

export const Tasks = () => {
    const location = useLocation(); 
    
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        deadline: '',
        priority: 'normal',
        image: ''
    });

    useEffect(() => {
        const loadAndScroll = async () => {
            try {
                const res = await axios.get(API_URL);
                setTasks(res.data);

                const params = new URLSearchParams(location.search);
                const taskId = params.get('id');

                if (taskId) {
                    setTimeout(() => {
                        const element = document.getElementById(`task-${taskId}`);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            
                            element.classList.add('highlight-task');
                            
                            setTimeout(() => {
                                element.classList.remove('highlight-task');
                            }, 2000);
                        }
                    }, 600);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        loadAndScroll();
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await axios.put(`${API_URL}/${editingId}`, taskData);
                setTasks(tasks.map(t => t.id === editingId ? res.data : t));
                setEditingId(null);
            } else {
                const res = await axios.post(API_URL, { ...taskData, completed: false });
                setTasks([...tasks, res.data]);
            }
            
            setTaskData({ title: '', description: '', deadline: '', priority: 'normal', image: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Deseja realmente excluir esta tarefa?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setTasks(tasks.filter(t => t.id !== id));
            } catch (error) {
                console.error('Erro ao deletar:', error);
            }
        }
    };

    const startEdit = (task) => {
        setTaskData({
            title: task.title,
            description: task.description,
            deadline: task.deadline,
            priority: task.priority,
            image: task.image
        });
        setEditingId(task.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    return (
        <div className='tasks-body'>
            <div className='tasks-header'>
                <h2>Gestão de Projetos</h2>
                <button 
                    onClick={() => {
                        setShowForm(!showForm);
                        if(showForm) setEditingId(null);
                    }}
                    className='add-task-btn'
                >
                    {showForm ? 'Fechar' : '+ Adicionar Tarefa'}
                </button>
            </div>

            {showForm && (
                <form className="detailed-form" onSubmit={handleSubmit}>
                    <h3>{editingId ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
                    <input
                        type="text"
                        placeholder='Título da tarefa'
                        value={taskData.title}
                        onChange={e => setTaskData({...taskData, title: e.target.value})}
                        required
                    />
                    <textarea
                        placeholder="Descrição detalhada"
                        value={taskData.description}
                        onChange={e => setTaskData({...taskData, description: e.target.value})}
                    ></textarea>
                    
                    <div className='form-row'>
                        <input
                            type="date"
                            value={taskData.deadline}
                            onChange={e => setTaskData({...taskData, deadline: e.target.value})}
                        />
                        <select
                            value={taskData.priority}
                            onChange={e => setTaskData({...taskData, priority: e.target.value})}
                        >
                            <option value="low">Baixa</option>
                            <option value="normal">Normal</option>
                            <option value="high">Urgente</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder='URL da imagem (opcional)'
                        value={taskData.image}
                        onChange={e => setTaskData({...taskData, image: e.target.value})}
                    />

                    <button type='submit' className='save-btn'>
                        {editingId ? 'Salvar Alterações' : 'Criar Tarefa'}
                    </button>
                </form>
            )}

            <div className='tasks-grid'>
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        id={`task-${task.id}`}
                        className={`task-card priority-${task.priority} ${task.completed ? 'completed' : ''}`}
                    >
                        <button className="check-btn" onClick={() => toggleTask(task)}>
                            {task.completed ? 
                                <CheckCircle className="icon-check" size={24} /> : 
                                <Circle className="icon-uncheck" size={24} />
                            }
                        </button>

                        {task.image && <img src={task.image} alt='task' className='task-img' />}
                        
                        <div className='task-content'>
                            <h3 className={task.completed ? 'text-strikethrough' : ''}>{task.title}</h3>
                            <p>{task.description}</p>
                            
                            {task.deadline && (
                                <span className='deadline-tag'>
                                    📅 {new Date(task.deadline).toLocaleDateString('pt-BR')}
                                </span>
                            )}

                            <div className='task-actions'>
                                <button onClick={() => startEdit(task)} className='btn-edit'>Editar</button>
                                <button onClick={() => handleDelete(task.id)} className='btn-delete-task'>Excluir</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};