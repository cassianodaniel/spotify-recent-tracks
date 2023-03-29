import Card from "./Card";
import TrackListStyle from "../scss/components/TrackList.module.scss";

export default function Loading() {
  const mockedArray = new Array(10).fill({ songName: "...", artistName: "..." });
  return (
    <ul className={[TrackListStyle["trackList"], "loading"].join(' ')}>
      {mockedArray.map((data, index) => {
        const { songName, artistName } = data;
        return <li
          aria-label={`${songName} - ${artistName}`}
          aria-describedby={`${songName} - ${artistName}`}
          key={index}>
          <Card songName={songName} artistName={artistName} isDisabled={true} />
        </li>
      })}
    </ul>
  );
};
