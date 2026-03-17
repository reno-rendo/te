import { Sparkles, TrendingUp, Clock, Play } from "lucide-react";

interface HeroSectionProps {
  title: string;
  description: string;
  icon?: "sparkles" | "trending" | "clock" | "play";
}

const icons = {
  sparkles: Sparkles,
  trending: TrendingUp,
  clock: Clock,
  play: Play,
};

export function HeroSection({ title, description, icon = "sparkles" }: HeroSectionProps) {
  const IconComponent = icons[icon];

  return (
    <div className="relative pt-24 pb-8 md:pt-28 md:pb-12">
      <div className="relative container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border-2 border-border shadow-solid-sm">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-primary uppercase tracking-tight">
            {title}
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
