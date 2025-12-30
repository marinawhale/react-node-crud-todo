import './Body.css'
import { QuickTasks } from './QuickTasks.jsx'
import { Tasks } from './Tasks.jsx'
import { Home } from './Home.jsx'
import { Routes, Route } from 'react-router-dom'

export const Body = () => {
    return (
        <div className='body'>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quick-tasks" element={<QuickTasks />} />
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </div>
    )
}