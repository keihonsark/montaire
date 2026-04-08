"use client";

export default function DiamondCaustics({ variant = "default" }: { variant?: "default" | "gold" | "subtle" }) {
  const configs = {
    default: [
      { type: "shard", top: "15%", left: "10%", animation: "causticDrift1 18s ease-in-out infinite", width: "250px", height: "50px", rotation: "25deg" },
      { type: "shard", top: "60%", right: "8%", animation: "causticDrift2 22s ease-in-out infinite 4s", width: "180px", height: "40px", rotation: "-15deg" },
      { type: "shard", top: "40%", left: "60%", animation: "causticDrift3 20s ease-in-out infinite 8s", width: "220px", height: "45px", rotation: "40deg" },
      { type: "spot-white", top: "25%", left: "30%", animation: "causticPulse 6s ease-in-out infinite 2s", size: "14px" },
      { type: "spot-blue", top: "50%", right: "25%", animation: "causticPulse 8s ease-in-out infinite 5s", size: "12px" },
      { type: "spot-white", top: "70%", left: "55%", animation: "causticPulse 7s ease-in-out infinite", size: "10px" },
      { type: "spot-rainbow", top: "35%", right: "40%", animation: "causticPulse 9s ease-in-out infinite 3s", size: "16px" },
      { type: "spot-gold", top: "80%", left: "20%", animation: "causticPulse 10s ease-in-out infinite 6s", size: "12px" },
    ],
    gold: [
      { type: "shard", top: "30%", left: "20%", animation: "causticDrift1 20s ease-in-out infinite", width: "200px", height: "45px", rotation: "30deg" },
      { type: "shard", top: "55%", right: "15%", animation: "causticDrift2 24s ease-in-out infinite 6s", width: "160px", height: "35px", rotation: "-20deg" },
      { type: "spot-gold", top: "20%", right: "30%", animation: "causticPulse 7s ease-in-out infinite 2s", size: "14px" },
      { type: "spot-white", top: "45%", left: "40%", animation: "causticPulse 8s ease-in-out infinite 4s", size: "12px" },
      { type: "spot-gold", top: "75%", left: "60%", animation: "causticPulse 9s ease-in-out infinite", size: "10px" },
      { type: "spot-blue", top: "60%", left: "15%", animation: "causticPulse 11s ease-in-out infinite 7s", size: "12px" },
    ],
    subtle: [
      { type: "shard", top: "40%", left: "30%", animation: "causticDrift1 25s ease-in-out infinite", width: "150px", height: "35px", rotation: "20deg" },
      { type: "spot-white", top: "30%", right: "35%", animation: "causticPulse 9s ease-in-out infinite 3s", size: "10px" },
      { type: "spot-blue", top: "65%", left: "50%", animation: "causticPulse 11s ease-in-out infinite 6s", size: "10px" },
      { type: "spot-gold", top: "50%", right: "20%", animation: "causticPulse 8s ease-in-out infinite", size: "8px" },
    ],
  };

  const elements = configs[variant];

  return (
    <div className="caustic-container">
      {elements.map((el, i) => {
        if (el.type === "shard") {
          return (
            <div
              key={i}
              className="caustic-shard"
              style={{
                top: el.top,
                left: el.left,
                right: el.right,
                width: el.width,
                height: el.height,
                transform: `rotate(${el.rotation})`,
                animation: el.animation,
              }}
            />
          );
        }
        return (
          <div
            key={i}
            className={`caustic-spot caustic-${el.type}`}
            style={{
              top: el.top,
              left: el.left,
              right: el.right,
              width: el.size,
              height: el.size,
              animation: el.animation,
            }}
          />
        );
      })}
    </div>
  );
}
