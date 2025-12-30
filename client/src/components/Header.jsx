import './Header.css'

import { Search, CalendarDays, User, Menu } from 'lucide-react'

export const Header = () => {
  return (
    <header className='header-container'>
        <div className='logo'>
            <p>TODO LIST</p>
        </div>
        <div className="header-search">
            <input type="text" placeholder='search' />
            <Search />
        </div>
        <div className="header-options">
            <CalendarDays />
            <User />
            <Menu />
        </div>
    </header>
  );
}