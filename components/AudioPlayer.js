"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ station }) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!station) {
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const streamUrl =
      station.url_resolved || station.url;

    if (!streamUrl) {
      setError("This station has no stream URL.");
      return;
    }

    setError("");
    setIsLoading(true);

    audio.src = streamUrl;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Playback error:", err);

        setIsPlaying(false);
        setIsLoading(false);
        setError("Unable to play this station.");
      });
  }, [station]);

  function togglePlay() {
    const audio = audioRef.current;

    if (!audio || !station) {
      return;
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setError("");
        })
        .catch((err) => {
          console.error(err);
          setError("Unable to play this station.");
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function handleEnded() {
    setIsPlaying(false);
  }

  function handleError() {
    setIsPlaying(false);
    setIsLoading(false);
    setError("The radio stream could not be played.");
  }

  if (!station) {
    return null;
  }

  return (
    <div className="mt-6 rounded-xl border bg-slate-600 p-4 shadow-sm">

      {/* Station Information */}
      <div className="flex items-center gap-4">

        {/* Logo */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-200">
          {station.favicon ? (
            <img
              src={station.favicon}
              alt={`${station.name || "Station"} logo`}
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-2xl">
              📻
            </span>
          )}
        </div>


        {/* Station Name */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-300">
            Now Playing
          </p>

          <h3 className="truncate text-lg text-gray-200 font-semibold">
            {station.name || "Unknown Station"}
          </h3>

          <p className="truncate text-sm text-gray-300">
            {station.country || ""}
          </p>
        </div>


        {/* Play / Pause */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={isLoading}
          className="shrink-0 rounded-full bg-slate-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading
            ? "Loading..."
            : isPlaying
              ? "⏸ Pause"
              : "▶ Play"}
        </button>

      </div>


      {/* Native Audio Controls */}
      <audio
        ref={audioRef}
        controls
        className="mt-4 w-full"
        onEnded={handleEnded}
        onError={handleError}
      />


      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}