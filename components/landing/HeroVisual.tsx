"use client";

import { useMemo, useEffect, useState } from "react";

function PixelPattern({ color, size = 8, className = "" }: { color: string; size?: number; className?: string }) {
  const pattern = useMemo(() =>
    Array.from({ length: 16 }).map(() => ({
      visible: Math.random() > 0.3,
      opacity: 0.6 + Math.random() * 0.4,
    })), []);

  return (
    <div className={`grid grid-cols-4 gap-0.5 ${className}`} style={{ width: size * 4 + 3, height: size * 4 + 3 }}>
      {pattern.map((cell, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: size,
            height: size,
            backgroundColor: cell.visible ? color : 'transparent',
            opacity: cell.opacity,
          }}
        />
      ))}
    </div>
  );
}

function DocumentPage({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  const widths = useMemo(() => ({
    top: Array.from({ length: 8 }).map(() => 60 + Math.random() * 30),
    bottom: Array.from({ length: 6 }).map(() => 50 + Math.random() * 40),
  }), []);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 overflow-hidden ${className}`} style={style}>
      <div className="space-y-3">
        <div className="h-3 w-16 bg-gray-300 rounded" />
        <div className="space-y-2">
          {widths.top.map((width, i) => (
            <div key={i} className="flex gap-2">
              <div className="h-2 bg-gray-200 rounded" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
        <div className="h-3 w-24 bg-gray-300 rounded mt-4" />
        <div className="space-y-2">
          {widths.bottom.map((width, i) => (
            <div key={i} className="flex gap-2">
              <div className="h-2 bg-gray-200 rounded" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TableDocument({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  const opacities = useMemo(() =>
    Array.from({ length: 50 }).map(() => 0.4 + Math.random() * 0.4), []);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 ${className}`} style={style}>
      <div className="grid grid-cols-5 gap-1">
        {opacities.map((opacity, i) => (
          <div
            key={i}
            className="h-3 bg-gray-200 rounded-sm"
            style={{ opacity }}
          />
        ))}
      </div>
    </div>
  );
}

function DataField({
  label,
  color,
  iconColor,
  style = {}
}: {
  label: string;
  color: string;
  iconColor: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="flex flex-col items-start" style={style}>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded flex items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          <div className="grid grid-cols-2 gap-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm opacity-80" />
            ))}
          </div>
        </div>
        <span
          className="px-2 py-1 rounded text-white text-xs font-mono"
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 w-36">
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-100 rounded w-full" />
          <div className="h-2 bg-gray-100 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

function QanoonAILogo({ pulseStyle }: { pulseStyle: React.CSSProperties }) {
  return (
    <div
      className="w-24 h-24 bg-white border-2 border-gray-300 rounded-lg shadow-lg flex items-center justify-center relative"
      style={pulseStyle}
    >
      <div className="w-16 h-16 relative flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#A21CAF]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v18M5 6l7 3 7-3M5 6v12l7 3 7-3V6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="9" r="2" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export default function HeroVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cssAnimations = `
    @keyframes docSlide1 {
      0% {
        transform: translateX(-100px) rotate(-2deg);
        opacity: 0;
      }
      15% {
        opacity: 1;
      }
      85% {
        opacity: 1;
        transform: translateX(450px) rotate(0deg) scale(0.9);
      }
      100% {
        transform: translateX(550px) rotate(0deg) scale(0.3);
        opacity: 0;
      }
    }

    @keyframes docSlide2 {
      0% {
        transform: translateX(-80px) rotate(1deg);
        opacity: 0;
      }
      15% {
        opacity: 1;
      }
      85% {
        opacity: 1;
        transform: translateX(380px) rotate(0deg) scale(0.9);
      }
      100% {
        transform: translateX(480px) rotate(0deg) scale(0.3);
        opacity: 0;
      }
    }

    @keyframes docSlide3 {
      0% {
        transform: translateX(-120px) rotate(-1deg);
        opacity: 0;
      }
      15% {
        opacity: 1;
      }
      85% {
        opacity: 1;
        transform: translateX(420px) rotate(0deg) scale(0.9);
      }
      100% {
        transform: translateX(520px) rotate(0deg) scale(0.3);
        opacity: 0;
      }
    }

    @keyframes dataSlide1 {
      0%, 40% {
        transform: translateX(-80px);
        opacity: 0;
      }
      60% {
        opacity: 1;
        transform: translateX(0px);
      }
      100% {
        opacity: 1;
        transform: translateX(30px);
      }
    }

    @keyframes dataSlide2 {
      0%, 45% {
        transform: translateX(-80px);
        opacity: 0;
      }
      65% {
        opacity: 1;
        transform: translateX(0px);
      }
      100% {
        opacity: 1;
        transform: translateX(40px);
      }
    }

    @keyframes dataSlide3 {
      0%, 50% {
        transform: translateX(-80px);
        opacity: 0;
      }
      70% {
        opacity: 1;
        transform: translateX(0px);
      }
      100% {
        opacity: 1;
        transform: translateX(35px);
      }
    }

    @keyframes dataSlide4 {
      0%, 55% {
        transform: translateX(-80px);
        opacity: 0;
      }
      75% {
        opacity: 1;
        transform: translateX(0px);
      }
      100% {
        opacity: 1;
        transform: translateX(25px);
      }
    }

    @keyframes dataSlide5 {
      0%, 60% {
        transform: translateX(-80px);
        opacity: 0;
      }
      80% {
        opacity: 1;
        transform: translateX(0px);
      }
      100% {
        opacity: 1;
        transform: translateX(45px);
      }
    }

    @keyframes particleMove {
      0% {
        transform: translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 0.7;
      }
      90% {
        opacity: 0.7;
      }
      100% {
        transform: translateX(300px);
        opacity: 0;
      }
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(162, 28, 175, 0.4);
      }
      50% {
        box-shadow: 0 0 20px 10px rgba(162, 28, 175, 0.2);
      }
    }

    @keyframes lineGlow {
      0%, 100% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
    }
  `;

  if (!mounted) {
    return (
      <section className="w-full bg-[#fafafa] py-12 overflow-hidden">
        <div className="grid-background">
          <div className="max-w-7xl mx-auto px-6 relative" style={{ minHeight: '500px' }} />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#fafafa] py-12 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: cssAnimations }} />

      <div className="grid-background">
        <div className="max-w-7xl mx-auto px-6 relative" style={{ minHeight: '500px' }}>
          <div
            className="absolute top-[25%]"
            style={{
              left: '0%',
              animation: 'docSlide1 6s ease-in-out infinite',
            }}
          >
            <DocumentPage className="w-52 h-72" />
          </div>

          <div
            className="absolute top-[50%]"
            style={{
              left: '5%',
              animation: 'docSlide2 6s ease-in-out infinite 2s backwards',
            }}
          >
            <TableDocument className="w-44 h-52" />
          </div>

          <div
            className="absolute top-[38%]"
            style={{
              left: '2%',
              animation: 'docSlide3 6s ease-in-out infinite 4s backwards',
            }}
          >
            <DocumentPage className="w-40 h-56" />
          </div>

          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? '#A21CAF' : '#94a3b8',
                left: `${10 + (i % 2) * 5}%`,
                top: `${38 + (i % 3) * 8}%`,
                animation: `particleMove 3s linear infinite ${i * 0.5}s`,
              }}
            />
          ))}

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div
                className="absolute -top-4 left-1/2 w-0.5 h-32 bg-[#A21CAF] -translate-y-full -translate-x-1/2"
                style={{ animation: 'lineGlow 2s ease-in-out infinite' }}
              />
              <div
                className="absolute -bottom-4 left-1/2 w-0.5 h-32 bg-[#A21CAF] translate-y-full -translate-x-1/2"
                style={{ animation: 'lineGlow 2s ease-in-out infinite' }}
              />
              <QanoonAILogo pulseStyle={{ animation: 'pulse 2s ease-in-out infinite' }} />
            </div>
          </div>

          <div
            className="absolute top-8"
            style={{
              right: '28%',
              animation: 'dataSlide1 6s ease-out infinite',
            }}
          >
            <DataField label="citation" color="#86198F" iconColor="#A21CAF" />
          </div>

          <div
            className="absolute top-12"
            style={{
              right: '5%',
              animation: 'dataSlide2 6s ease-out infinite',
            }}
          >
            <DataField label="court_fee" color="#86198F" iconColor="#A21CAF" />
          </div>

          <div
            className="absolute top-[38%]"
            style={{
              right: '10%',
              animation: 'dataSlide3 6s ease-out infinite',
            }}
          >
            <DataField label="statute" color="#0E7490" iconColor="#06B6D4" />
          </div>

          <div
            className="absolute bottom-[25%]"
            style={{
              right: '30%',
              animation: 'dataSlide4 6s ease-out infinite',
            }}
          >
            <DataField label="petition" color="#86198F" iconColor="#A21CAF" />
          </div>

          <div
            className="absolute bottom-[30%]"
            style={{
              right: '8%',
              animation: 'dataSlide5 6s ease-out infinite',
            }}
          >
            <DataField label="precedent" color="#86198F" iconColor="#A21CAF" />
          </div>

          <div className="absolute left-16 top-16">
            <PixelPattern color="#A21CAF" size={6} />
          </div>
          <div className="absolute left-[38%] top-20">
            <PixelPattern color="#06B6D4" size={5} />
          </div>
          <div className="absolute left-[20%] bottom-16">
            <PixelPattern color="#F59E0B" size={6} />
          </div>
          <div className="absolute right-[35%] top-[22%]">
            <PixelPattern color="#F97316" size={5} />
          </div>
          <div className="absolute right-[22%] bottom-12">
            <PixelPattern color="#84CC16" size={6} />
          </div>
          <div className="absolute left-1/2 top-10">
            <PixelPattern color="#EF4444" size={4} />
          </div>
        </div>
      </div>
    </section>
  );
}
