import React, { useState } from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';


export default function Playlist({ playlist, setPlaylist }) {

  const [cookies] = useCookies(['access_token']);

  console.log('playlistttt: ', playlist);
  const removeSong = (song) => {
    //make axios request to backend to delete
    axios
      .delete("http://localhost:3000/playlist", {
        data: {
          song,
        },
      })
      .then((result) => {
        console.log(result);
        if (result.data.success) {
          const updatedPlaylist = playlist.filter(
            (s) => s.trackUri !== song.trackUri
          );
          console.log(updatedPlaylist);
          setPlaylist(updatedPlaylist);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addToSpotify = () => {
    // const token = cookies.get('access_token');
    // Get value of specific cookie
    const token = cookies['access_token'];
    
    // const tokenType = cookies.get('token_type');
    
    fetch('https://api.spotify.com/v1/users/kirstenm2000/playlists', {
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
      console.log('New playlist created:', data);
      const trackUris = playlist.map(track => {
        return track.trackUri
      })
      console.log('track uri list: ', trackUris);

      // console.log(trackUris)
      // const updatedPlaylist = playlist.filter((s) => {
      //   return s.trackUri !== undefined;
      // })
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
          console.log('DATA: ', data);
          const host = window.location.host;
          let url;
          if (host === 'localhost:8080' || host === 'localhost:3000') url = 'http://localhost:3000/playlist';
          else url = 'https://spindr.onrender.com/playlist';
          // if(data) {
          axios.delete(url).then(result =>{
            if(result.data.success) {
              setPlaylist([])
            }
          })
        }
        ) 
    })

    .catch(error => console.error('Error creating playlist:', error));

    //console.log('current playlist: ', playlist);
    // const updatedPlaylist = playlist.filter((s) => {
    //     return s.trackUri !== undefined;
    //   })
    //console.log('updated playlist: ', updatedPlaylist);

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
                  <button className="btn-del" onClick={() => removeSong(song)}>
                    -
                  </button>
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
