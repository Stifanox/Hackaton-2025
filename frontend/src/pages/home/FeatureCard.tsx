import React from "react";

interface FeatureCardProps {
  icon: any;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => {
  return (
    <div
      className={`
        relative
        flex
        w-[380px]
        text-left
        flex-col
        px-4
        py-4
        rounded-lg
        shadow-zinc-700
        border-[1px]
        border-zinc-200
        bg-transparent
        bg-fixed
        bg-no-repeat
        bg-[radial-gradient(circle_at_50%_50%,rgba(159,122,234,0.3),rgba(255,255,255,0.3)_40%,transparent_60%)]
      `}
    >
      <span className="text-lime-400">{icon}</span>
      <h2 className="font-semibold mt-3">{title}</h2>
      <p className="text-zinc-600">{desc}</p>
    </div>
  );
};

export default FeatureCard;
