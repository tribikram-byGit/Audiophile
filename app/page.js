// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        
//         <div className="flex justify-center items-center gap-4 text-base font-medium sm:flex-row">
//           <Image
//           className="dark:invert h-5 w-[100px]"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-3 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

import {
  getPopularStations,
} from "@/lib/radioBrowser";

import StationList from "@/components/StationList";
import AudioPlayer from "@/components/AudioPlayer";


export default function Home() {

  // All stations returned by Radio Browser
  const [stations, setStations] = useState([]);

  // Currently selected/playing station
  const [currentStation, setCurrentStation] =
    useState(null);

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
      />

    </main>
  );
}
