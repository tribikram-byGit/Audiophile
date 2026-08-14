"use client";

import StationCard from "./StationCard";

export default function StationList({ stations, onPlay }) {
  if (!stations || stations.length === 0) {
    return (
      <div className="empty-stations">
        <p>No radio stations found.</p>
      </div>
    );
  }

  return (
    <div className="station-list flex flex-col gap-2">
      {stations.map((station) => (
        <StationCard
          key={station.stationuuid}
          station={station}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}