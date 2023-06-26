import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Card from "./card";
import * as Spotify from "../api/fetch";
import NavBar from "./navbar";
import { useLocation } from "react-router-dom";
import Playlist from "./playlist";
import debounce from "lodash.debounce";

export default function MainPage() {
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [currentCard, setCurrentCard] = useState();
  const [playlist, setPlaylist] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setCurrentCard(recommendedTracks[0]);
  }, [recommendedTracks]);

  useEffect(() => {
    Spotify.getRecommendations(location.state.genre.toLowerCase().replace(/\s/g, '')).then(
      (data) => { 
        if (data && data.trackDetails) {
          setRecommendedTracks(data.trackDetails);
        }
      }
    );

    axios.get('/api/playlist')
      .then((response) => {
          setPlaylist(response.data.favList);
      });
  }, []);

  useEffect(() => {
    return () => {
      debouncedAddToPlaylist.cancel();
    };
  }, []);

  const host = window.location.host;
  let url;
  if (host === 'localhost:8080' || host === 'localhost:3000') url = 'http://localhost:3000/playlist';
  else url = 'https://spindr.onrender.com/playlist';

  // add song to playlist when user swipes right
  const addToPlaylist = useCallback(
    (song) => {
      axios
        .post('/api/playlist', {
          song,
        })
        .then((result) => {
          if (result.data.success) {
            setPlaylist((prevPlaylist) => {
              const updatedPlaylist = [...prevPlaylist];
              // check if song is already in the playlist
              const songExists = updatedPlaylist.some((item) => item === song);
              if (!songExists) {
                updatedPlaylist.push(song);
              }
              return updatedPlaylist;
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [setPlaylist]
  );

  const debouncedAddToPlaylist = useCallback(
    debounce(
      (song) => {
        addToPlaylist(song);
      },
      200,
      { leading: false }
    ),
    [addToPlaylist]
  );

  return (
    <>
      {/* //div for flex container */}
      <div className="mainPageContainer">
        <NavBar />
        <div className="mainCardContainer">
          {currentCard && (
            <Card
              recommendedTracks={recommendedTracks}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
              playlist={playlist}
              setPlaylist={setPlaylist}
              debouncedAddToPlaylist={debouncedAddToPlaylist}
            />
          )}
        </div>
        <Playlist playlist={playlist} setPlaylist={setPlaylist} />
      </div>
    </>
  );
}
