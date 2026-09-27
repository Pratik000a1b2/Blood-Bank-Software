import React from 'react';
import { BloodAvailabilitySummary, BloodGroup } from '../../types';
import { Droplet, ArrowRight, Building2 } from 'lucide-react';

interface BloodStockCardsProps {
  availability: BloodAvailabilitySummary[];
  onSelectGroup?: (group: BloodGroup) => void;
}

export const BloodStockCards: React.FC<BloodStockCardsProps> = ({
  availability,
  onSelectGroup,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {availability.map((item) => {
        const isOutOfStock = item.totalUnits === 0;
        const isLow = item.totalUnits < 15 && item.totalUnits > 0;

        return (
          <div
            key={item.bloodGroup}
            onClick={() => onSelectGroup?.(item.bloodGroup)}
            className={`group relative p-3 rounded-xl border transition-all cursor-pointer text-center bg-white ${
              isOutOfStock
                ? 'border-slate-200 opacity-75 hover:border-slate-400'
                : isLow
                ? 'border-amber-200/80 hover:border-amber-400 shadow-xs'
                : 'border-slate-200 hover:border-rose-400 shadow-xs hover:shadow-md'
            }`}
          >
            {/* Blood Drop Icon & Group */}
            <div className="mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-sm bg-rose-50 text-rose-700 border border-rose-100 group-hover:scale-105 transition-transform">
              {item.bloodGroup}
            </div>

            {/* Units Available */}
            <div className="text-xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
              {item.totalUnits}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Units</div>

            {/* Status Indicator */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                  isOutOfStock
                    ? 'text-rose-700 bg-rose-50'
                    : isLow
                    ? 'text-amber-700 bg-amber-50'
                    : 'text-emerald-700 bg-emerald-50'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1">
              <Building2 className="w-2.5 h-2.5" />
              <span>{item.availableBanksCount} bank{item.availableBanksCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
