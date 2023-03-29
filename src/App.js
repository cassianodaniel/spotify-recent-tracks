import React, { useEffect } from "react";
import { Input } from "./components/index";
import TrackListStyles from "./scss/components/TrackList.module.scss";
import { useTracks } from "./hooks/useTracks";
import "./scss/base.scss";
import { Toaster } from "react-hot-toast";

/**
  * Get the returned params from Spotify Auth
  * @typedef {Object} ReturnedParams
  * @property {String} access_token
  * @property {String} expires_in
  * @property {String} token_type
  * @returns {ReturnedParams} - The returned params from Spotify Auth
*/
const getReturnedParamsFromSpotifyAuth = (hash) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});

  return paramsSplitUp;
};

const App = () => {
  const {
    hasTracks,
    setTracks,
    showNegativeResponse,
    showTracks,
    input,
    setInput,
    handleUserRecentlyPlayedTracks,
    numOfFoundTracksFromSearchWord,
  } = useTracks();

  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);
      localStorage.clear();
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
    }
  });

  useEffect(() => {
    handleUserRecentlyPlayedTracks();
  }, [handleUserRecentlyPlayedTracks]);

  return (
    <div className="main">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="container-fluid text-start">
        <div className="row">
          <div className="col-sm-4 col-8">
            <div className="input-group mb-3">
              <Input
                value={input}
                setValue={setInput}
                setTracks={setTracks}
                placeholder="Search for words"
              />
            </div>
          </div>
          <div className="col-sm-8 col-4 d-flex flex-row align-items-center text-center">
            <h4 className="fw-bold primary">
              {numOfFoundTracksFromSearchWord ? numOfFoundTracksFromSearchWord.length : "0"}
            </h4>
            <h4 className="fw-normal ms-2">
              words found
            </h4>
          </div>
        </div>
        <div className="row">
          <h4 className="col-12 fw-bold">Tweets</h4>
        </div>
        <ul className={TrackListStyles["trackList"]}>
          {hasTracks ? showTracks : showNegativeResponse}
        </ul>
      </div>
    </div >
  );
};

export default App;