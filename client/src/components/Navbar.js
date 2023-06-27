import { Link } from "react-router-dom";

const Navbar = () => {

    return (

        <div className="navbar">
            <Link to="/"><p id='summoner'></p><p id='dash'> Dash</p></Link>
        </div>
    )
}

export default Navbar;