import React, { useState } from "react";

const Songs = () => {

    const [songs, setSongs] = useState([
        {
            title: "test_title",
            artist: "test_artist",
            cover: "https://i.scdn.co/image/ab67616d0000b273e1c8a9c8e5f1b2c3d4e5f6",
            url: "https://open.spotify.com/track/1cTZMwcBJT0Ka3UJPXOeeN?si=1234567890abcdef"
        },
        {
            title: "test_title",
            artist: "test_artist",
            cover: "https://i.scdn.co/image/ab67616d0000b273e1c8a9c8e5f1b2c3d4e5f6",
            url: "https://open.spotify.com/track/1cTZMwcBJT0Ka3UJPXOeeN?si=1234567890abcdef"
        }
    ])

    return (
        <div className="mood-songs">
            <h2>Recommended Songs</h2>
<ul className="space-y-4">
  {songs.map((song, index) => (
    <li key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition">
      
      <div>
        <h3 className="font-semibold">{song.title}</h3>
        <p className="text-sm text-slate-400">{song.artist}</p>
      </div>

      <button className="bg-purple-600 px-3 py-2 rounded-lg hover:bg-purple-700">
        ▶
      </button>

    </li>
  ))}
</ul>


        </div>
    )
}

export default Songs;
