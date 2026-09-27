import React, { useState } from 'react';
import { BloodGroup, BloodInventoryItem, BloodBank } from '../../types';
import { bloodBankService } from '../../services/bloodBankService';
import { BloodBadge, StatusIndicator } from '../common/BloodBadge';
import { Search, MapPin, Phone, Building2, Filter, AlertCircle, ArrowRight } from 'lucide-react';

interface BloodSearchViewProps {
  initialGroup?: BloodGroup | '';
  onRequestBlood: (group: BloodGroup, bank?: BloodBank) => void;
}

export const BloodSearchView: React.FC<BloodSearchViewProps> = ({
  initialGroup = '',
  onRequestBlood,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(initialGroup);
  const [selectedCity, setSelectedCity] = useState<string>('Akola');
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('ALL');

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const banks = bloodBankService.getBloodBanks();
  const inventory = bloodBankService.getInventory();

  // Extract unique cities
  const cities = Array.from(new Set(banks.map((b) => b.city)));

  // Join inventory with blood bank details
  const searchResults = inventory
    .map((item) => {
      const bank = banks.find((b) => b.bloodBankId === item.bloodBankId);
      let status: 'Available' | 'Low Stock' | 'Not Available' = 'Available';
      if (item.availableUnits === 0) {
        status = 'Not Available';
      } else if (item.availableUnits < 10) {
        status = 'Low Stock';
      }

      return {
        ...item,
        bank,
        status,
      };
    })
    .filter((res) => {
      if (!res.bank) return false;
      if (selectedGroup && res.bloodGroup !== selectedGroup) return false;
      if (selectedCity && res.bank.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (selectedBankId && res.bloodBankId !== selectedBankId) return false;
      if (availabilityFilter !== 'ALL' && res.status !== availabilityFilter) return false;
      return true;
    });

  const handleResetFilters = () => {
    setSelectedGroup('');
    setSelectedCity('');
    setSelectedBankId('');
    setAvailabilityFilter('ALL');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Blood Availability Search</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Find verified blood units across certified blood centres by group, region, and hospital proximity
        </p>
      </div>

      {/* Search / Filter Controls Panel */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Blood Group Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Blood Group
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              <option value="">All Blood Groups (Any)</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City / Region
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Blood Bank Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Blood Bank Facility
            </label>
            <select
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              <option value="">All Facilities</option>
              {banks.map((b) => (
                <option key={b.bloodBankId} value={b.bloodBankId}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Availability Status
            </label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Not Available">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-500">
            Showing <strong>{searchResults.length}</strong> matching blood stock inventory records
          </div>
          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Grid */}
      {searchResults.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Blood Stock Matches Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, selecting a nearby city, or request an emergency donor broadcast.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((item) => {
            const bank = item.bank!;
            return (
              <div
                key={item.inventoryId}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Group & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <BloodBadge group={item.bloodGroup} size="md" />
                    <StatusIndicator status={item.status} />
                  </div>

                  {/* Stock Quantity */}
                  <div className="mb-3">
                    <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight tabular-nums">
                      {item.availableUnits} <span className="text-xs font-normal text-slate-500">Units Available</span>
                    </div>
                    {item.reservedUnits > 0 && (
                      <div className="text-[11px] text-amber-600 mt-0.5">
                        ({item.reservedUnits} units currently reserved for approved requests)
                      </div>
                    )}
                  </div>

                  {/* Blood Bank Details */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <h4 className="font-semibold text-slate-900 line-clamp-1">{bank.name}</h4>
                    <p className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{bank.address}, {bank.city}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{bank.contactNumber}</span>
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1 font-mono">
                      Expiry batch: {item.expiryDate}
                    </div>
                  </div>
                </div>

                {/* Request CTA Button */}
                <div className="pt-4 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => onRequestBlood(item.bloodGroup, bank)}
                    disabled={item.availableUnits === 0}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white"
                  >
                    <span>Request From This Centre</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
