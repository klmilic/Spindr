import React, { useState } from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';


export default function Playlist({ playlist, setPlaylist }) {

  const [cookies] = useCookies(['access_token', 'token_type']);

  const removeSong = (song) => {
    //make axios request to backend to delete
    axios
      .delete("http://localhost:3000/playlist", {
        data: {
          song,
        },
      })
      .then((result) => {
        if (result.data.success) {
          const updatedPlaylist = playlist.filter(
            (s) => s.trackUri !== song.trackUri
          );
          setPlaylist(updatedPlaylist);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addToSpotify = () => {
    const token = cookies['access_token'];
    const tokenType = cookies['token_type'];

    //need to set header with token for axios fetch requests
    axios.defaults.headers.common['Authorization'] = `${tokenType}: ${token}`;

    // try {
    //   const response = await axios.get('https://api.spotify.com/v1/me');
    //   const { display_name } = response.data;
    //   return display_name;
    // } catch (err) {
    //   console.log(err);
    // }

    // get display name to add to user's playlist
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const display_name = data.display_name;
        fetch(`https://api.spotify.com/v1/users/${display_name}/playlists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            'name': 'Spindr Playlist',
            'public': false // set to true if you want the playlist to be public
          })
        })
        .then(response => response.json())
        .then(data => {
          const trackUris = playlist.map(track => {
            return track.trackUri
        });
    
          fetch(`https://api.spotify.com/v1/playlists/${data.id}/tracks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              uris: trackUris,
              position: 0
            })
          }).then(response => response.json())
            .then(data => {
              // const host = window.location.host;
              // // let url;
              // // if (host === 'localhost:8080' || host === 'localhost:3000') url = 'http://localhost:3000/playlist';
              // // else url = 'https://spindr.onrender.com/playlist';
              // // if(data) {
              axios.delete('/api/playlist/all').then(result =>{
                if(result.data.success) {
                  setPlaylist([])
                }
              })
            }
            ) 
            .catch(err => {
              console.log('Error: ', err);
            })
        })
        .catch(error => console.error('Error adding playlist to Spotify:', error));
      })
      .catch(err => {
        console.log('Error in fetching user display name: ', err);
      });
  }

  return (
    <div className="playlistContainer">
      <ul className="playlist-container">
        <h3>Swiped-Right Playlist</h3>

        <div className="list-container">
          {playlist.length === 0 ? (
            <h4>Add a song to the playlist by dragging the album cover to the right!</h4>
          ) : (
            playlist.map((song, index) => {
              return (
                <li key={index}>
                  <div className="textBox">
                    <span>{`${song.artistName[0].name} - ${song.trackName}`}</span>
                  </div>
                </li>
              );
            })
          )}
        </div>
      </ul>
      <button className="playlistBtn" onClick={addToSpotify}>Create Playlist on Spotify</button>
    </div>
  );
}
