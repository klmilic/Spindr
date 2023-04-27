import React, { useState, useRef } from "react";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";
import TinderCard from "react-tinder-card"; //external module
import { Howl, Howler } from "howler";

//https://p.scdn.co/mp3-preview/30a5d9f993ed4a46b8e9d8fd52393f58b25fb370?cid=bba3237352b24f7194d0f1145475350c
export default function Card({
  recommendedTracks,
  addToPlaylist,
  currentCard,
  setCurrentCard,
}) {
  console.log(currentCard);

  const [currentSong, setCurrentSong] = useState();
  const [counter, setCounter] = useState(0);

  const swiped = (direction) => {
    console.log(direction);
    setCounter(counter + 1);
    setCurrentCard(recommendedTracks[counter + 1]);
    if (currentSong) stopAudio();
  };

  const outOfFrame = (dir, index, song) => {
    console.log("direction from outOfFrame ", dir);
    console.log("current track to add to playlist:", song);
    if (dir === "right") {
      //addToPlaylist(refs.current[index]);
      addToPlaylist(currentCard);
      //console.log(currentSong);
    }
    // if (currentSong) stopAudio();
  };

  const stopAudio = () => {
    currentSong.stop();
  };

  const playAudio = () => {
    const sound = new Howl({
      src: currentCard.previewUrl,
      html5: true,
      volume: 0.1,
    });
    setCurrentSong(sound);

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
        style={{ color: "white", marginTop: "16rem" }}
      >{`${currentCard.artistName[0].name} - ${currentCard.trackName}`}</p>
      <button style={{ marginTop: "1rem" }} onClick={() => playAudio()}>
        Play
      </button>
      <button onClick={() => stopAudio()}>Stop</button>
    </>
  );
}
