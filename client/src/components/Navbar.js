import { Link } from "react-router-dom";

const Navbar = () => {

    return (

        <div className="navbar">
            <Link to="/"><p id='summoner'>Home</p></Link>
        </div>
    )
}

export default Navbar;