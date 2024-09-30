import { NavLink } from "react-router-dom";
import './Nav.css'

const Nav = () => {
  // TODO: Add necessary code to display the navigation bar and link between the pages
  return (
    <nav>
      <ul className="link">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/SavedCandidates">Potential Candidates</NavLink></li>


      </ul>
    </nav>
  )
};

export default Nav;
