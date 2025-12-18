'use client';

export default function NumbersSection() {
    const brands = [
        { name: "COCA-COLA", color: "text-white" },
        { name: "SAMSUNG", color: "text-blue-500" },
        { name: "SPOTIFY", color: "text-green-500" },
        { name: "REI", color: "text-yellow-500" },
        { name: "TESLA", color: "text-red-600" },
        { name: "APPLE", color: "text-white" },
        { name: "DISNEY", color: "text-purple-600" },
        { name: "NIKE", color: "text-pink-600" },
    ];

    return (
        <div className="py-12 bg-white/[0.02] border-y border-white/[0.03] overflow-hidden whitespace-nowrap relative">
            <div className="flex animate-marquee">
                <div className="flex items-center gap-24 px-12 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition duration-500 cursor-default">
                    {brands.map((brand, i) => (
                        <span key={i} className={`text-2xl font-black italic tracking-tighter ${brand.color}`}>
                            {brand.name}
                        </span>
                    ))}
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex items-center gap-24 px-12 grayscale opacity-30 pointer-events-none">
                    {brands.map((brand, i) => (
                        <span key={`dup-${i}`} className={`text-2xl font-black italic tracking-tighter ${brand.color}`}>
                            {brand.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
