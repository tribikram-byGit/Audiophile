"use client";

export default function StationCard({ station, onPlay }) {
  const {
    name,
    favicon,
    country,
    language,
    codec,
    bitrate,
    tags,
    url_resolved,
    url,
  } = station;

  const streamUrl = url_resolved || url;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-slate-600/60 p-4 shadow-sm shadow-indigo-700/40">

      {/* Station Logo */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-pink-100">
        {favicon ? (
          <img
            src={favicon}
            alt={`${name || "Station"} logo`}
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


      {/* Station Information */}
      <div className="min-w-0 flex-1">

        <h3 className="truncate text-lg font-semibold">
          {name || "Unknown Station"}
        </h3>

        <p className="text-sm text-gray-300">
          {country || "Unknown country"}
        </p>


        {/* Station Details */}
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-300">

          {language && (
            <span>
              🌐 {language}
            </span>
          )}

          {codec && (
            <span>
              🎵 {codec}
            </span>
          )}

          {bitrate > 0 && (
            <span>
              {bitrate} kbps
            </span>
          )}

        </div>


        {/* Tags */}
        {tags && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags
              .split(",")
              .slice(0, 3)
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-pink-800"
                >
                  {tag.trim()}
                </span>
              ))}
          </div>
        )}

      </div>


      {/* Play Button */}
      <button
        type="button"
        onClick={() => onPlay(station)}
        disabled={!streamUrl}
        className="shrink-0 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ▶ Play
      </button>

    </div>
  );
}