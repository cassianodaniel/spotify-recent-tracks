import React, { useCallback, useMemo, useState } from "react";
import { Card, Loading } from "../components/index";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import toast from 'react-hot-toast';

const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/webapp";
const SPACE_DELIMITER = "%20";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-read-private",
  'user-read-recently-played'
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);
const HABIT_CLIENT_ID = "f06e27393d304e9a80f197826dc23bce";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID ? process.env.REACT_APP_CLIENT_ID : HABIT_CLIENT_ID;
const LOGIN_URL = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;

export const useTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [input, setInput] = useState("");

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => track.artistName.toLowerCase().includes(input.toLowerCase()));
  }, [tracks, input]);

  const hasTracks = filteredTracks.length > 0;
  const showNoTracksLayout = <p>No tracks found</p>;
  const userHasTyped = input.length > 0;
  const showNegativeResponse = userHasTyped && filteredTracks.length === 0 ? showNoTracksLayout : <Loading />;

  const handleDrop = useCallback((droppedItem) => {
    if (input.length > 0) {
      toast.error("You can't reorder the search list!");
      return;
    }
    const ignoreDropOutsideDroppableContainer = !droppedItem.destination
    if (ignoreDropOutsideDroppableContainer) return;
    const updatedList = [...tracks];
    const [removedDraggedItem] = updatedList.splice(droppedItem.source.index, 1);
    (function dropItem() {
      updatedList.splice(droppedItem.destination.index, 0, removedDraggedItem);
    })();
    setTracks(updatedList);
  }, [tracks, input.length]);

  const showTracks = useMemo(() => {
    return <DragDropContext onDragEnd={handleDrop}>
      <Droppable droppableId="list-container">
        {(provided) => (
          <div
            className="list-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {filteredTracks.map((item, index) => (
              <div key={item.id}>
                <Draggable draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      className="item-container"
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <Card
                        songName={item.songName}
                        artistName={item.artistName}
                        avatar={item.avatar}
                        isMarked={item.isMarked}
                        id={item.id}
                        tracks={tracks}
                        setTracks={setTracks}
                        inputValue={input}
                      />
                    </div>
                  )}
                </Draggable>
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  }, [filteredTracks, input, tracks, handleDrop, setTracks]);

  const getAuthorization = useCallback(() => {
    window.location = LOGIN_URL;
  }, []);

  const handleUserRecentlyPlayedTracks = useCallback(() => {
    const url = "https://api.spotify.com/v1/me/player/recently-played?limit=15";
    const method = "GET";
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    };
    const body = { method, headers };

    try {
      fetch(url, body)
        .then(data => {
          const unauthorized = data.status === 401
          const notRegistered = data.status === 403;
          // TODO - Unexpected issue: catch block is not executed when the user is not registered or not authorized.
          if (unauthorized || notRegistered) {
            toast.error(unauthorized ? "Redirecting..." : "You are not registered at the Spotify for Developers Dashboard or Invalid Client ID!", {
              duration: 100000
            });
            return getAuthorization();
          } else {
            toast.success('Successfully loaded!')
            return data.json();
          }
        })
        .then(recentPlayed => {
          if (recentPlayed) {
            setTracks(
              recentPlayed["items"].map((song) => {
                return {
                  songName: song.track["name"],
                  artistName: song.track["artists"].map((detail) => detail["name"]).join(", "),
                  avatar: song.track.album.images[0]["url"],
                  isMarked: false,
                  id: song.played_at
                };
              })
            );
          }
        });
    } catch (error) {
      throw error;
    }
  }, [getAuthorization]);

  const numOfFoundTracksFromSearchWord = useMemo(() => {
    return input.length > 0 ?
      filteredTracks.filter((track) => {
        const artistName = track.artistName.toLowerCase();
        const foundTracksFromUniqueName = artistName.replace(/,/g, "").split(" ").some((artist) => {
          if (artist.includes(input.toLowerCase())) {
            return true;
          }
          return false;
        })
        const foundTracksFromComposedNames = artistName.split(",").some((artist) => {
          const parsedArtist = artist.replace(/ /g, "").toLowerCase();
          const parsedInput = input.toLowerCase().replace(/ /g, "");
          if (parsedArtist.includes(parsedInput)) {
            return true;
          }
          return false;
        });
        return foundTracksFromUniqueName + foundTracksFromComposedNames;
      })
      : 0;
  }, [filteredTracks, input]);

  return {
    setTracks,
    hasTracks,
    showNegativeResponse,
    showTracks,
    input,
    setInput,
    handleUserRecentlyPlayedTracks,
    numOfFoundTracksFromSearchWord,
    filteredTracks,
    tracks,
  };
};