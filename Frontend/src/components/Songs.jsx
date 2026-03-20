import React, { useState, useRef, useEffect } from "react";

const Songs = ({ songs, mood }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  const playSong = (song) => {
    // if same song clicked → restart it
    if (currentSong?.audio === song.audio) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    setCurrentSong(song);
  };

  // handle playback properly when song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.error("Playback error:", err);
      });
    }
  }, [currentSong]);

  if (!songs || songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold mb-2">🎧 Recommended Songs</h2>
        <p className="text-slate-400">
          No song found for mood:{" "}
          <span className="text-indigo-400 font-semibold">{mood}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🎧 Recommended Songs</h2>
        <p className="text-sm text-slate-400">
          Songs for mood:{" "}
          <span className="text-indigo-400 font-semibold">{mood}</span>
        </p>
      </div>

      {/* Song List */}
      <div className="grid grid-cols-1 gap-4">
        {songs.map((song) => (
          <div
            key={song.id || song.audio} // better key
            className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{song.title}</h3>
              <p className="text-sm text-slate-400">{song.artist}</p>
            </div>

            <button
              onClick={() => playSong(song)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
            >
              ▶
            </button>
          </div>
        ))}
      </div>

      {/* Player */}
      {currentSong && (
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-white/10 backdrop-blur-lg">
          <div className="mb-3">
            <p className="font-semibold">{currentSong.title}</p>
            <p className="text-sm text-slate-400">{currentSong.artist}</p>
          </div>

          <audio ref={audioRef} controls className="w-full">
            <source src={currentSong.audio} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default Songs;