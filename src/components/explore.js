import React, { useState, useEffect } from "react";
import { useNavigate, useHistory } from "react-router-dom";
import Navbar from './navbar';

/* IMPORTING IMAGES */
import bgImg from '../../assets:images/explorebg2.jpg'
import pop from '../../assets:images/lover1.jpeg';
import rock from '../../assets:images/rock.png';
import country from '../../assets:images/country.jpeg';
import ambient from '../../assets:images/ambient.jpeg';
import jazz from '../../assets:images/jazz.jpeg';
import classical from '../../assets:images/classical.jpeg';
import latin from '../../assets:images/latin.jpeg';
import techno from '../../assets:images/techno.jpeg';
import hiphop from '../../assets:images/hiphop.jpeg';
import blues from '../../assets:images/blues.jpg';
import chill from '../../assets:images/chill.jpeg';
import indie from '../../assets:images/indie.jpeg';

const genreList = ['Pop','Rock','Country','Ambient','Jazz','Classical','Latin','Techno','Hip-Hop', 'Blues', 'Chill', 'Indie'];
const popList =[pop,rock,country,ambient,jazz,classical,latin,techno,hiphop,blues,chill,indie];

export default function ExplorePage() {
    const [genre, setGenre] = useState("");
    const navigate = useNavigate();
    // const history = useHistory();

    const handleClick = async(e) => {
        navigate('/songs', {state: {genre: e.target.name}})
    }

    const handleChange = async(value) => {
        navigate('/songs', {state: {genre: value}})
    }
   
    return(
        <>       
        <Navbar/>
         <div className= 'exploreContainer'>
            <div className="carousel" style={{backgroundImage: `url(${bgImg})`}}></div>
            <div className='searchContainer'>
                <input id = "inputField" placeholder="Enter genre..." ></input>
                <button className='searchBtn' onClick={(e) => handleChange(document.getElementById('inputField').value)}>Search</button>
            </div>
            <div className="genres">
                <div className= "genreContainer">  {/* generates genre containers based on the genreList array */}
                {( 
                    genreList.map((el, i) => {
                    return  <div key={i} className="genreWrapper">
                            <div className="card" style={{marginTop: 35, backgroundImage: `url(${popList[i]})`}}></div>
                            <button className="btn" id='btn' onClick={handleClick} name={el}>{el}</button>
                        </div> 
                    })
                )}                
                </div>
            </div>
         </div>
        </>
    )
}
