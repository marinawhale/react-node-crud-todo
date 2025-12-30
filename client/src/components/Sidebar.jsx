import './Sidebar.css'
import Photo from '../assets/profile-picture.jpg'
import { NavLink } from 'react-router-dom'

export const Sidebar = () => {
    return (
        <div className='sidebar-container'>
            <div className='sidebar-personals'>
                <div className='sidebar-photo'>
                    <img src={Photo} alt="profile-photo" />
                </div>
                <div className='sidebar-txt'>
                    <p>
                        Marina Ferrari<br/>
                        <span>marinaferrairm@gmail.com</span>
                    </p>
                </div>
            </div>

            <div className='sidebar-categories'>
                <nav>
                    <p><NavLink to="/" className="sidebar-link">home</NavLink></p>
                    <p><NavLink to="/tasks" className="sidebar-link">tasks</NavLink></p>
                    <p><NavLink to="/quick-tasks" className="sidebar-link">quick tasks</NavLink></p>
                </nav>
            </div>
        </div>
    )
}