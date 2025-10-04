import { Link } from "react-router-dom";

const Navbar = () =>
{
    <nav>
        <h1>Sri Pratibha U.P School</h1>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/academics">Academics</Link></li>
            <li><Link to="/contact">Contact</Link></li>
        </ul>
    </nav>
};

export default Navbar;