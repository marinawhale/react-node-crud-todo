import './Home.css'
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './Home.css'

const API_URL = 'http://localhost:5000/tasks';

export const Home = () => {
    const [highPriorityTasks, setHighPriorityTasks] = useState([])
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const res = await axios.get(API_URL)
                setTasks(res.data)
            } catch (error) {
                console.error('erro ao carregar dados do dashboard', error)
            }
        }
        loadTasks()
    }, [])

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await axios.get(API_URL)
                const alerts = res.data.filter(task => task.priority === 'high' && !task.completed)
                setHighPriorityTasks(alerts)
            } catch (error) {
                console.error('Erro ao buscar alertas', error)
            }
        }
        fetchAlerts()
    }, [])

    const data = [
        { name:'Urgente', value: tasks.filter(t => t.priority === 'high').length, color: '#ff4d4d'},
        { name:'Normal', value: tasks.filter(t => t.priority === 'normal').length, color: '#4da3ff'},
        { name:'Baixa', value: tasks.filter(t => t.priority === 'low').length, color: '#2ecc71'},
    ].filter(item => item.value > 0)

    const navigate = useNavigate()

    const handleTaskClick = (id) => {
        navigate(`/tasks?id=${id}`)
    }

    return (
        <div className='home-container'>
            <div className='home-alerts'>
                <p>Tarefas vencendo</p>
                {highPriorityTasks.map(task => (
                    <div key={task.id} className={`task-card priority-${task.priority} ${task.completed ? 'completed' : ''}`}
                    onClick={() => handleTaskClick(task.id)}
                    style={{ cursor: 'pointer' }}
                    >
                        <div className='task-content'>
                            <h3 className={task.completed ? 'text-strikethrough' : ''}>{task.title}</h3>
                            
                            {task.deadline && (
                                <span className='deadline-tag'>
                                    📅 {new Date(task.deadline).toLocaleDateString('pt-BR')}
                                </span>
                            )}
                        </div>
                    </div>
    ))}
            </div>

            <div className='home-dashboard'>
                <p>Dashboard</p>
                <div className='chart-box' style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className='home-stats'>
                <div>
                    <span>Total de tarefas: </span>
                    <strong>{tasks.length}</strong>
                </div>
                    <div>
                        <span>Tarefas Concluídas: </span>
                        <strong>{tasks.filter(t => t.completed).length}</strong>
                    </div>
            </div> 
        </div>

    )
}