import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useCallback } from 'react';
import defaultAvatar from '../assets/avatars/default-avatar.png';
import styles from '../scss/components/Card.module.scss';

/**
 * @property {String} songName - The name of the track
 * @property {String} artistName - The name of the artist
 * @property {Image} avatar - The image of the album cover
 * @property {Boolean} isMarked - Whether the track is marked or not
 * @property {Object} tracks - The list of tracks
 * @property {Function} setTracks - The function to set the list of tracks
 * @property {string} inputValue - The value of the input
 * @property {string | undefined} id - The id of the track
 * @property {boolean | undefined} isDisabled - Whether the clickable state is disabled or not
 */
const Card = ({ songName, artistName, avatar, isMarked, tracks, setTracks, inputValue, id, isDisabled }) => {
  const handleMark = useCallback(() => {
    const foundTrack = tracks.find((track) => track.id === id);
    const trackIsMarked = foundTrack.isMarked;
    setTracks((previousTracks) => previousTracks.map((track) => {
      if (track.id === id) {
        return {
          ...track,
          isMarked: !trackIsMarked,
        };
      }
      return track;
    }));
  }, [tracks, setTracks, id]);

  const showAvatar = avatar ? avatar : defaultAvatar;
  const showSongName = songName ? songName : "";
  const artistNameArray = artistName ? artistName.split(',') : null;
  const isValidArtistNameArr = !!artistNameArray && artistNameArray[0] !== '...';
  const isInputIsValid = inputValue && inputValue.length > 0 && inputValue !== '';
  const toBeHighlightedRequirements = isValidArtistNameArr && isInputIsValid

  const mustHighlight = useCallback((name) => {
    if (toBeHighlightedRequirements) {
      const parsedName = name.toLowerCase().charAt(0) === " " ? name.toLowerCase().slice(1) : name.toLowerCase();
      const parsedValue = inputValue.toLowerCase();
      return parsedName.includes(parsedValue);
    }
  }, [toBeHighlightedRequirements, inputValue]);

  return useMemo(() => (
    <div
      onClick={isDisabled ? () => { } : handleMark}
      role={isDisabled ? "" : "button"}
      className={
        classNames({
          "card": true,
          "mb-2": true,
          [styles.cardContainer]: !isDisabled,
        })
      }
    >
      {isMarked ? <div className={styles['lapel']} /> : null}
      <div className="card-body d-flex flex-row">
        <img className="rounded-1" alt="This is the track's album" src={showAvatar} width="50" height="50" />
        <div className="d-flex flex-column ms-3">
          <h5 className="card-title">{showSongName}</h5>
          <div className="d-flex flex-wrap artists">
            {artistNameArray.map((artist, i, array) => {
              return (
                <span key={i}
                  className={
                    classNames({
                      [styles.artistName]: true,
                      [styles.highlighted]: mustHighlight(artist),
                    })
                  }>{artist.concat(i + 1 === array.length ? '' : ', ')}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  ), [artistNameArray, handleMark, isMarked, mustHighlight, showAvatar, showSongName, isDisabled]);
};

export default Card;