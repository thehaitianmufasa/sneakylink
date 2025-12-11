"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export function DemoVideosSection() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const videos = [
    {
      title: "Lead Comes In",
      description: "See how a customer finds your site and submits a request",
      thumbnail: "/assets/video-thumbnails/lead-comes-in.jpg",
      videoUrl: "#", // Replace with actual video URL
      icon: "📞",
      color: "blue"
    },
    {
      title: "Instant SMS Response",
      description: "Watch the automatic SMS reply go out in seconds",
      thumbnail: "/assets/video-thumbnails/sms-response.jpg",
      videoUrl: "#", // Replace with actual video URL
      icon: "💬",
      color: "green"
    },
    {
      title: "Dashboard Notification",
      description: "Get real-time alerts on your lead dashboard",
      thumbnail: "/assets/video-thumbnails/dashboard.jpg",
      videoUrl: "#", // Replace with actual video URL
      icon: "📊",
      color: "purple"
    },
    {
      title: "Revenue Captured",
      description: "See the revenue counter update with each lead",
      thumbnail: "/assets/video-thumbnails/revenue.jpg",
      videoUrl: "#", // Replace with actual video URL
      icon: "💰",
      color: "orange"
    }
  ];

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (activeVideo === index) {
      video.pause();
      setActiveVideo(null);
    } else {
      // Pause any currently playing video
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index) {
          v.pause();
        }
      });

      video.play();
      setActiveVideo(index);
    }
  };

  // Lazy load videos when they come into view
  useEffect(() => {
    const currentRefs = videoRefs.current; // Copy to local variable
    const observers = currentRefs.map((video, index) => {
      if (!video) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Preload video when it comes into view
              video.load();
            }
          });
        },
        { threshold: 0.25 }
      );

      observer.observe(video);
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (observer && currentRefs[index]) {
          observer.unobserve(currentRefs[index]!);
        }
      });
    };
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
            🎬 See It In Action
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Watch How We <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Capture Every Lead</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From the moment a customer finds you to the instant you&apos;re notified. See the entire process in under 2 minutes.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Video/Thumbnail */}
              <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => handleVideoClick(index)}>
                {/* Placeholder for video - replace with actual video element */}
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
                  video.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  video.color === 'green' ? 'from-green-500 to-green-600' :
                  video.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  'from-orange-500 to-orange-600'
                }`}>
                  <span className="text-6xl">{video.icon}</span>
                </div>

                {/* Play/Pause Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="bg-white rounded-full p-4 transform group-hover:scale-110 transition-transform shadow-xl">
                    {activeVideo === index ? (
                      <Pause className="w-8 h-8 text-gray-900" />
                    ) : (
                      <Play className="w-8 h-8 text-gray-900 ml-1" />
                    )}
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                  0:45
                </div>

                {/* Hidden video element for future implementation */}
                <video
                  ref={el => { videoRefs.current[index] = el }}
                  className="hidden"
                  preload="none"
                  playsInline
                >
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
              </div>

              {/* Video Info */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Below Videos */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-6">
            Ready to capture 100% of your leads like this?
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openQuoteModal'))}
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-600 transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Your Free Setup Call
          </button>
        </div>
      </div>
    </section>
  );
}
