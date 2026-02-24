"use client";

const stats = [
  { number: "300,000+", label: "Court Judgments" },
  { number: "44", label: "AI Tools" },
  { number: "99.9%", label: "Citation Accuracy" },
  { number: "5", label: "High Courts Covered" },
];

function ScatteredPixel({
  color,
  top,
  left,
  size = 8,
}: {
  color: string;
  top: string;
  left: string;
  size?: number;
}) {
  return (
    <div
      className="absolute rounded-sm"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        top,
        left,
      }}
    />
  );
}

export default function StatsSection() {
  const pixels = [
    { color: "#22C55E", top: "15%", left: "8%" },
    { color: "#A21CAF", top: "25%", left: "92%" },
    { color: "#EF4444", top: "70%", left: "5%" },
    { color: "#06B6D4", top: "80%", left: "88%" },
    { color: "#F59E0B", top: "10%", left: "45%" },
    { color: "#A21CAF", top: "85%", left: "50%" },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-20 relative overflow-hidden border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6 relative">
        {pixels.map((pixel, i) => (
          <ScatteredPixel key={i} {...pixel} />
        ))}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 tracking-tight leading-none mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
