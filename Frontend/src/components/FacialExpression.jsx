import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

function MoodDetector() {
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  const [mood, setMood] = useState("INITIALIZING");
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState("LOADING");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const getMoodConfig = (currentMood) => {
    const map = {
      HAPPY: { emoji: "😊", color: "text-yellow-400" },
      SAD: { emoji: "😔", color: "text-blue-400" },
      ANGRY: { emoji: "😠", color: "text-red-400" },
      SURPRISED: { emoji: "😲", color: "text-purple-400" },
      NEUTRAL: { emoji: "😐", color: "text-slate-300" },
      DISGUSTED: { emoji: "🤢", color: "text-green-400" },
      FEARFUL: { emoji: "😨", color: "text-indigo-400" },
    };
    return map[currentMood] || { emoji: "🔍", color: "text-white" };
  };

  const moodConfig = getMoodConfig(mood);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models/weights";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setStatus("READY");
      } catch {
        setStatus("ERROR");
      }
    };
    loadModels();

    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  const startDetection = () => {
    if (!modelsLoaded || intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      const video = webcamRef.current?.video;
      if (!video || video.readyState !== 4) return;

      setStatus("SCANNING");

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detection) {
        setMood("NO FACE");
        setConfidence(0);
        return;
      }

      const expressions = detection.expressions;
      const [emotion, value] = Object.entries(expressions).reduce(
        (a, b) => (a[1] > b[1] ? a : b)
      );

      setMood(emotion.toUpperCase());
      setConfidence(Math.round(value * 100));
    }, 700);
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 px-4 py-10flex flex-col items-center px-4">
      
      {/* Navbar */}
     <nav className="w-full max-w-5xl mx-auto py-6 flex justify-between items-center">

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          🎧 Moody Player
        </h1>
      
        <span className={`text-xs px-3 py-1 rounded-full border 
          ${status === "ERROR" ? "border-red-500 text-red-400" :
            status === "SCANNING" ? "border-purple-500 text-purple-400 animate-pulse" :
            "border-white/20 text-slate-400"}`}>
          {status}
        </span>
      </nav>

      {/* Card */}
      <div className="w-full max-w-md mx-auto mt-10 backdrop-blur-xl bg-white/5 
                border border-white/10 rounded-3xl overflow-hidden shadow-xl">

        {/* Webcam */}
        <div className="relative aspect-[4/3]">
          <Webcam
            ref={webcamRef}
            onUserMedia={startDetection}
            className="w-full h-full object-cover scale-x-[-1]"
            videoConstraints={{ facingMode: "user" }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{moodConfig.emoji}</span>
            <div>
              <p className={`text-2xl font-black ${moodConfig.color}`}>
                {mood}
              </p>
              <p className="text-xs text-slate-400">
                Facial expression detected
              </p>
            </div>
          </div>

          {/* Confidence bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Confidence</span>
              <span>{confidence}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
             </div>
           <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Live Mood Detection</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Your mood is analyzed in real time using facial expressions.
          </p>
          <button className="w-fit bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
            Start Listening
          </button>
          <div/>
        </div>
        </div>
      
      </div>
      

      {/* Footer hint */}
      <p className="mt-8 text-xs tracking-widest text-slate-500 uppercase">
        Music engine pending integration
      </p>
    </div>
  );
}

export default MoodDetector;
