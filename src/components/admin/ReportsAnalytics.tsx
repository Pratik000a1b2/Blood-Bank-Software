import React, { useState } from 'react';
import { bloodBankService } from '../../services/bloodBankService';
import { Download, FileText, CheckCircle2, TrendingUp, Droplet } from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const reports = bloodBankService.getReportsData();

  const handleExportCSV = () => {
    const rows = [
      ['Blood Group', 'Available Units', 'Total Voluntary Donations'],
      ...reports.stockByGroup.map((s, idx) => [
        s.bloodGroup,
        s.units.toString(),
        (reports.donationsByGroup[idx]?.units || 0).toString(),
      ]),
      [],
      ['Request Status', 'Count'],
      ['Pending', reports.requestsByStatus.Pending.toString()],
      ['Approved', reports.requestsByStatus.Approved.toString()],
      ['Processing', reports.requestsByStatus.Processing.toString()],
      ['Completed', reports.requestsByStatus.Completed.toString()],
      ['Rejected', reports.requestsByStatus.Rejected.toString()],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `blood_bank_analytics_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reports & Clinical Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical summaries, group-wise donation distribution, and fulfillment analytics
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>CSV Report generated and downloaded to your local device.</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Recorded Donations</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {reports.totalDonations} <span className="text-xs font-normal text-slate-500">Sessions</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Clinical Requisitions</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {reports.totalRequests} <span className="text-xs font-normal text-slate-500">Requests</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Completed / Dispensed</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {reports.requestsByStatus.Completed} <span className="text-xs font-normal text-slate-500">Units Transfused</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Requisition Fulfillment Rate</span>
          <div className="text-2xl font-bold font-mono text-blue-700 mt-1 tabular-nums">
            {reports.totalRequests > 0
              ? Math.round(
                  ((reports.requestsByStatus.Completed + reports.requestsByStatus.Approved) /
                    reports.totalRequests) *
                    100
                )
              : 100}
            %
          </div>
        </div>
      </div>

      {/* Blood Group Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Blood Group-Wise Inventory vs Donations</h3>
          <span className="text-xs text-slate-400">Current live ledger data</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Available In Stock</th>
                <th className="py-3 px-4">Voluntary Units Donated</th>
                <th className="py-3 px-4">Inventory Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {reports.stockByGroup.map((item, idx) => {
                const donUnits = reports.donationsByGroup[idx]?.units || 0;
                return (
                  <tr key={item.bloodGroup} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-rose-700 text-sm">
                      {item.bloodGroup}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-900 tabular-nums font-bold">
                      {item.units} Units
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 tabular-nums">
                      {donUnits} Units
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full max-w-[120px] bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, item.units * 3)}%` }}
                          className="bg-rose-600 h-full rounded-full"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requisitions Status Distribution */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Clinical Request Pipeline Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[10px] text-amber-700 font-bold uppercase block">Pending</span>
            <span className="text-xl font-bold font-mono text-amber-900 mt-1 block">
              {reports.requestsByStatus.Pending}
            </span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <span className="text-[10px] text-blue-700 font-bold uppercase block">Processing</span>
            <span className="text-xl font-bold font-mono text-blue-900 mt-1 block">
              {reports.requestsByStatus.Processing}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] text-emerald-700 font-bold uppercase block">Approved</span>
            <span className="text-xl font-bold font-mono text-emerald-900 mt-1 block">
              {reports.requestsByStatus.Approved}
            </span>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-700 font-bold uppercase block">Completed</span>
            <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
              {reports.requestsByStatus.Completed}
            </span>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <span className="text-[10px] text-rose-700 font-bold uppercase block">Rejected</span>
            <span className="text-xl font-bold font-mono text-rose-900 mt-1 block">
              {reports.requestsByStatus.Rejected}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
