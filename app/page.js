"use client";

import { useEffect, useState } from "react";

import {
  getPopularStations, getStationsByCountry,
} from "@/lib/radioBrowser";

import StationList from "@/components/StationList";
import AudioPlayer from "@/components/AudioPlayer";


export default function Home() {

  // All stations returned by Radio Browser
  const [stations, setStations] = useState([]);

  // Currently selected/playing station
  const [currentStation, setCurrentStation] = useState(null);
  const [shouldPlay, setShouldPlay] = useState(false);

  // Loading state for API request
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState("");


  // --------------------------------------------------
  // Load stations when the page opens
  // --------------------------------------------------

  useEffect(() => {

    async function loadStations() {

      try {

        setLoading(true);
        setError("");

        const data =
          await getPopularStations(20);

        setStations(data);

      } catch (err) {

        console.error(err);

        setError(
          "Unable to load radio stations."
        );

      } finally {

        setLoading(false);

      }

    }

    loadStations();

  }, []);


  // --------------------------------------------------
  // Called when a StationCard's Play button is clicked
  // --------------------------------------------------

  function handlePlay(station) {

    console.log(
      "Selected station:",
      station
    );

    setCurrentStation(station);
    setShouldPlay(true);
  }


  return (
    <main>

      <p>
        Popular radio stations
      </p>


      {/* Loading */}

      {loading && (
        <p>
          Loading stations...
        </p>
      )}


      {/* Error */}

      {error && (
        <p>
          {error}
        </p>
      )}


      {/* Stations */}

      {!loading && !error && (
        <StationList
          stations={stations}
          onPlay={handlePlay}
        />
      )}


      {/* Audio Player */}

      <AudioPlayer
        station={currentStation}
        shouldPlay={shouldPlay}
        onPlayHandled={() => setShouldPlay(false)}
      />

    </main>
  );
}
