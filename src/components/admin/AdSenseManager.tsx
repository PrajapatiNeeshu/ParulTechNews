import React, { useState } from 'react';
import { DollarSign, TrendingUp, Eye, MousePointer, Plus, Check, ShieldAlert } from 'lucide-react';
import { AdUnit } from '../../types';

interface AdSenseManagerProps {
  ads: AdUnit[];
  onToggleAdStatus: (adId: string) => void;
}

export const AdSenseManager: React.FC<AdSenseManagerProps> = ({
  ads,
  onToggleAdStatus,
}) => {
  const totalRevenue = ads.reduce((acc, ad) => acc + ad.revenueUsd, 0);
  const totalImpressions = ads.reduce((acc, ad) => acc + ad.impressions, 0);
  const totalClicks = ads.reduce((acc, ad) => acc + ad.clicks, 0);
  const avgCtr = ((totalClicks / (totalImpressions || 1)) * 100).toFixed(2);

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header */}
      <div className="bg-[#0D0D0D] text-white p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00FF41] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>// MONETIZATION &amp; PROGRAMMATIC AD ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Programmatic Revenue &amp; Ad Inventory
          </h2>
          <p className="text-xs text-white/50 max-w-xl mt-1 font-mono">
            Responsive leaderboard slots, sticky sidebars, and in-article contextual units with CLS-safe placeholders.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-black p-4 rounded-2xl border border-white/10">
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-white/50">// TOTAL 30D REVENUE</div>
            <div className="text-3xl font-black font-mono text-[#00FF41]">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="text-[11px] text-white/70 font-mono">
            <div>✓ {totalImpressions.toLocaleString()} IMPRESSIONS</div>
            <div>✓ {avgCtr}% GLOBAL CTR</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#0D0D0D] p-5 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">// AD IMPRESSIONS</span>
            <Eye className="w-4 h-4 text-[#00FF41]" />
          </div>
          <div className="text-2xl font-black text-white">{totalImpressions.toLocaleString()}</div>
          <div className="text-[10px] text-[#00FF41] font-semibold mt-1">↑ +14.2% VS LAST CYCLE</div>
        </div>

        <div className="bg-[#0D0D0D] p-5 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">// AD CLICKS</span>
            <MousePointer className="w-4 h-4 text-[#F27D26]" />
          </div>
          <div className="text-2xl font-black text-white">{totalClicks.toLocaleString()}</div>
          <div className="text-[10px] text-white/40 mt-1">AVG ECPM $4.10</div>
        </div>

        <div className="bg-[#0D0D0D] p-5 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">// AVERAGE CTR</span>
            <TrendingUp className="w-4 h-4 text-[#00FF41]" />
          </div>
          <div className="text-2xl font-black text-[#00FF41]">{avgCtr}%</div>
          <div className="text-[10px] text-white/40 mt-1">BENCHMARK 1.80%</div>
        </div>
      </div>

      {/* Ad Units Table */}
      <div className="bg-[#0D0D0D] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-tight text-white">Configured Inventory Units</h3>
          <span className="text-[10px] font-mono text-white/40 uppercase">// AUTO-INJECTED INTO LAYOUTS WITHOUT CLS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black border-b border-white/10 text-white/50 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">// UNIT &amp; SLOT</th>
                <th className="p-4">// PLACEMENT</th>
                <th className="p-4">// DIMENSIONS</th>
                <th className="p-4">// IMPRESSIONS</th>
                <th className="p-4">// REVENUE</th>
                <th className="p-4 text-right">// STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-sans font-bold text-white uppercase">{ad.name}</div>
                    <div className="text-white/40 text-[10px] font-mono">{ad.slotCode}</div>
                  </td>
                  <td className="p-4 uppercase font-medium text-white/70">
                    {ad.placement.replace('_', ' ')}
                  </td>
                  <td className="p-4 font-mono text-white/60">
                    {ad.dimensions}
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {ad.impressions.toLocaleString()}
                  </td>
                  <td className="p-4 font-mono font-black text-[#00FF41]">
                    ${ad.revenueUsd.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onToggleAdStatus(ad.id)}
                      className={`px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                        ad.isActive
                          ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/30 hover:bg-[#00FF41]/30'
                          : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {ad.isActive ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
