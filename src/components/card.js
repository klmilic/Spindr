import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import TinderCard from "react-tinder-card"; //external module
import { Howl, Howler } from "howler";


//https://p.scdn.co/mp3-preview/30a5d9f993ed4a46b8e9d8fd52393f58b25fb370?cid=bba3237352b24f7194d0f1145475350c
export default function Card({
  recommendedTracks,
  currentCard,
  setCurrentCard,

  debouncedAddToPlaylist,
}) {
  // console.log(currentCard);
  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState();
  const [counter, setCounter] = useState(0);
  const [buttonText, setButtonText] = useState("Play");

  const swiped = (direction) => {
    // console.log(direction);
    setCounter(counter + 1);
    setCurrentCard(recommendedTracks[counter + 1]);
    if (currentSong) stopAudio();
  };

  const outOfFrame = (dir, index, song) => {
    // console.log("direction from outOfFrame ", dir);
    // console.log("current track to add to playlist:", song);
    if (dir === "right") {
      //addToPlaylist(refs.current[index]);
      debouncedAddToPlaylist(currentCard);
      //console.log(currentSong);
    }
    // if (currentSong) stopAudio();
  };

  const stopAudio = () => {
    currentSong.stop();
    setButtonText("Play");
  };

  const playAudio = () => {
    const sound = new Howl({
      src: currentCard.previewUrl,
      html5: true,
      volume: 0.1,
    });
    setCurrentSong(sound);
    setButtonText("Stop");
    sound.play();
  };

  return (
    <>
      <div className="cardContainer">
        {currentCard && (
          <TinderCard
            swipeRequirementType="position"
            className="swipe"
            key={currentCard.albumImg.url}
            onSwipe={(dir) => swiped(dir)}
            onCardLeftScreen={(dir) => outOfFrame(dir)}
            preventSwipe={["up", "down"]}
          >
            <div
              className="card container1"
              style={{ backgroundImage: `url(${currentCard.albumImg.url})` }}
            ></div>
          </TinderCard>
        )}
      </div>
      <p
        style={{ color: "white" }}
      >{`${currentCard.artistName[0].name} - ${currentCard.trackName}`}</p>
      <button
        className="cardBtn"
        onClick={() => (buttonText === "Play" ? playAudio() : stopAudio())}
      >
        {buttonText}
      </button>
    </>
  );
}
