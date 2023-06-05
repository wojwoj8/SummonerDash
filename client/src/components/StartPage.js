import React from "react";

const StartPage = () => {
    
    return(

        <div className="App">
            <h1>Welcome at SummonerDash!!!</h1>
            <form method='GET'>
                <label htmlFor='search'>search</label>
                <input name="search" placeholder='Name'></input>
                <button type="submit">Search!</button>
            </form>
    </div>
    )
}
export default StartPage;