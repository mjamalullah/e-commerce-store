import React from "react";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Zap,
  Award,
  CreditCard,
  Package,
} from "lucide-react";

interface TrustFeatureData {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

interface TrustBadgesSectionProps {
  features: TrustFeatureData[];
}

const iconMap: Record<string, any> = {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Zap,
  Award,
  CreditCard,
  Package,
};

export default function TrustBadgesSection({ features }: TrustBadgesSectionProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feat) => {
          const IconComponent = iconMap[feat.iconName] || ShieldCheck;
          return (
            <div
              key={feat.id}
              className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all flex items-center gap-3.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <IconComponent className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {feat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
