"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({
  station,
  shouldPlay,
  onPlayHandled,
}) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState("");

  /*
   * Load a new station whenever the station changes.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !station) {
      return;
    }

    const streamUrl =
      station.url_resolved || station.url;

    if (!streamUrl) {
      setError("This station has no stream URL.");
      setIsPlaying(false);
      setIsLoading(false);

      return;
    }

    // Stop the previous station
    audio.pause();

    // Reset states
    setIsPlaying(false);
    setError("");
    setIsLoading(true);

    // Load new stream
    audio.src = streamUrl;
    audio.load();

    /*
     * If the user selected the station,
     * start playing it.
     */
    if (shouldPlay) {
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

          setError("Click Play to start this station.");
        })
        .finally(() => {
          // Tell page.js that we've handled the play request
          onPlayHandled?.();
        });
    }

  }, [station, shouldPlay, onPlayHandled]);


  /*
   * Play / Pause button
   */
  function togglePlay() {
    const audio = audioRef.current;

    if (!audio || !station) {
      return;
    }

    if (audio.paused) {
      setIsLoading(true);
      setError("");

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
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }


  /*
   * Mute / Unmute
   */
  function toggleMute() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.muted = !audio.muted;

    setIsMuted(audio.muted);
  }


  /*
   * Volume
   */
  function handleVolumeChange(event) {
    const newVolume = Number(event.target.value);

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = newVolume;

    if (newVolume > 0 && audio.muted) {
      audio.muted = false;
      setIsMuted(false);
    }

    if (newVolume === 0) {
      audio.muted = true;
      setIsMuted(true);
    }

    setVolume(newVolume);
  }


  /*
   * Audio events
   */

  function handleLoadStart() {
    setIsLoading(true);
    setError("");
  }

  function handleCanPlay() {
    setIsLoading(false);
  }

  function handlePlaying() {
    setIsPlaying(true);
    setIsLoading(false);
    setError("");
  }

  function handleWaiting() {
    if (isPlaying) {
      setIsLoading(true);
    }
  }

  function handlePause() {
    setIsPlaying(false);
  }

  function handleEnded() {
    setIsPlaying(false);
    setIsLoading(false);
  }

  function handleError() {
    setIsPlaying(false);
    setIsLoading(false);

    setError(
      "The radio stream could not be played."
    );
  }


  /*
   * Don't show the player until
   * a station has been selected.
   */
  if (!station) {
    return null;
  }


  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-500 bg-slate-700 shadow-lg">

      {/* =========================
          Station Information
      ========================== */}
      <div className="flex items-center gap-4 p-4">

        {/* Station Logo */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">

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

          <div className="flex items-center gap-2">

            {/* Status dot */}
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                error
                  ? "bg-red-500"
                  : isPlaying
                    ? "animate-pulse bg-green-400"
                    : isLoading
                      ? "animate-pulse bg-yellow-400"
                      : "bg-slate-400"
              }`}
            />

            <p className="text-xs font-medium uppercase tracking-wider text-slate-300">
              {error
                ? "Error"
                : isLoading
                  ? "Connecting..."
                  : isPlaying
                    ? "Live"
                    : "Ready"}
            </p>

          </div>


          <h3 className="mt-1 truncate text-lg font-semibold text-white">
            {station.name || "Unknown Station"}
          </h3>


          {station.country && (
            <p className="truncate text-sm text-slate-300">
              {station.country}
            </p>
          )}

        </div>


        {/* Play / Pause */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={isLoading}
          aria-label={
            isPlaying
              ? "Pause station"
              : "Play station"
          }
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {isLoading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-white" />
          ) : isPlaying ? (
            "⏸"
          ) : (
            "▶"
          )}

        </button>

      </div>


      {/* =========================
          Error
      ========================== */}
      {error && (
        <div className="mx-4 mb-4 flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">

          <span>
            ⚠️
          </span>

          <span>
            {error}
          </span>

        </div>
      )}


      {/* =========================
          Controls
      ========================== */}
      <div className="border-t border-slate-500/50 bg-slate-800/50 px-4 py-3">

        <div className="flex items-center gap-3">

          {/* Mute */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={
              isMuted
                ? "Unmute"
                : "Mute"
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg text-slate-200 transition hover:bg-slate-700"
          >
            {isMuted || volume === 0
              ? "🔇"
              : volume < 0.5
                ? "🔉"
                : "🔊"}
          </button>


          {/* Volume */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={
              isMuted
                ? 0
                : volume
            }
            onChange={handleVolumeChange}
            aria-label="Volume"
            className="h-1.5 w-32 cursor-pointer accent-white"
          />


          {/* Volume Percentage */}
          <span className="w-10 text-right text-xs text-slate-400">
            {Math.round(
              (isMuted ? 0 : volume) * 100
            )}
            %
          </span>


          {/* Status */}
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">

            {isLoading && (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                Connecting
              </>
            )}

            {!isLoading &&
              isPlaying &&
              !error && (
                <>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  Streaming
                </>
              )}

            {!isLoading &&
              !isPlaying &&
              !error &&
              "Ready"}

          </div>

        </div>

      </div>


      {/* =========================
          Actual Audio Element
      ========================== */}
      <audio
        ref={audioRef}
        preload="none"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onPlaying={handlePlaying}
        onWaiting={handleWaiting}
        onEnded={handleEnded}
        onPause={handlePause}
        onError={handleError}
      />

    </div>
  );
}