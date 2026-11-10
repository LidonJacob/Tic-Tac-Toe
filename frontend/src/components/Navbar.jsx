import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <nav>
        <div className="text-2xl font-bold text-cyan-400"> 
            Tic-Tac-Toe
        </div>
        <div className="flex items-center gap-6">
            <Link to={'/'}>Home</Link>
            <Link to={'/history'}>Game</Link>
        </div>
    </nav>

    
  )
}

export default Navbar