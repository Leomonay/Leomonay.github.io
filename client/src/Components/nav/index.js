import {Link} from 'react-router-dom';
import './index.css';

export default function index(){
    return(
        <div className="navBar">
            <div className='barTitle'>
                <h1>
                Leo Monay's Web Developing Portfolio
                </h1>
            </div>
            <div className="menuBar">
                <Link className="navLink" exact to="/">Welcome</Link>
                <Link className="navLink" to="/about">About</Link>
                <Link className="navLink" to="/Projects">Projects</Link>
                <Link className="navLink" to="/Contact">Contact</Link>                
            </div>
        </div>
    )
}