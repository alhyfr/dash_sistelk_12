'use client'
import { Loader2, Zap } from "lucide-react";
import loadingImage from "@/assets/logo/loading-image.png";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function LoadingPage({ 
  duration = 1000, // Default 3 detik
  onComplete = null // Callback saat loading selesai
}) {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const targetDuration = duration; // Duration dalam milliseconds
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / targetDuration) * 100, 100);
      
      setCount(Math.floor(progress));
      
      // Jika sudah mencapai 100% dan belum complete
      if (progress >= 100 && !isComplete) {
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, 16); // Update setiap 16ms untuk smooth animation (60fps)

    return () => clearInterval(interval);
  }, [duration, onComplete, isComplete]);
  return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center p-4 overflow-hidden z-[9999] bg-white">
      <div className="text-center relative z-10">
        {/* Main Loading Container */}
        <div className="relative mb-16">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Main Image */}
              <div className="relative z-10">
                <Image 
                  src={loadingImage} 
                  alt="loading" 
                  width={80} 
                  height={80}
                  style={{
                    animation: 'float 3s ease-in-out infinite, pulse 2s ease-in-out infinite'
                  }}
                />
              </div>
             
            </div>
          </div>
        </div>
        {/* Animated Progress Bar */}
        <div className="w-40 mx-auto mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-full transition-all duration-75 ease-out"
              style={{ width: `${count}%` }}
            ></div>
          </div>
        </div>
        {/* Loading Percentage */}
        <div className="text-sm text-gray-500 font-mono">
          <span className="count-display">{count}</span>%
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes count-up {
          0% { content: '0'; }
          100% { content: '100'; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        
        .animate-fade-in {
          animation: fade-in 1s ease-in-out;
        }
        
        .animate-count-up {
          animation: count-up 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}