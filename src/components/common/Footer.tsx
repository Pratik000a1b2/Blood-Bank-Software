import React from 'react';
import { Phone, Mail, MapPin, Heart, Shield } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Blood Bank Management System
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              A digital healthcare network connecting voluntary blood donors, patients, and accredited blood banks to ensure safe, rapid blood delivery in critical situations.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              Compliant with National Blood Transfusion Council (NBTC) and FDA standards.
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">Quick Portals</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onTabChange('search-blood')} className="hover:text-white transition-colors cursor-pointer">
                  Search Blood Availability
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('donate-blood')} className="hover:text-white transition-colors cursor-pointer">
                  Register as a Donor
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('blood-education')} className="hover:text-white transition-colors cursor-pointer">
                  Donation Eligibility Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('source-code')} className="hover:text-white transition-colors cursor-pointer text-rose-400">
                  Architecture & Codebase
                </button>
              </li>
            </ul>
          </div>

          {/* Blood Groups Monitored */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">Blood Groups Monitored</h4>
            <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-[11px] text-slate-300">
              <span className="bg-slate-800/80 px-2 py-1 rounded text-center">A+</span>
              <span className="bg-slate-800/80 px-2 py-1 rounded text-center">A-</span>
              <span className="bg-slate-800/80 px-2 py-1 rounded text-center">B+</span>
              <span className="bg-slate-800/80 px-2 py-1 rounded text-center">B-</span>
              <span className="bg-slate-800/80 px-2 py-1 rounded text-center">AB+</span>
              <span className="bg-slate-800/80 px-2 py-1 rounded text-center">AB-</span>
              <span className="bg-slate-800/80 px-2 py-1 rounded text-center">O+</span>
              <span className="bg-slate-800/80 px-2 py-1 rounded text-center">O-</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-2">
              Universal Donor: <strong>O-</strong> · Universal Recipient: <strong>AB+</strong>
            </p>
          </div>

          {/* Emergency & Support */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">24/7 Helpline & Contact</h4>
            <div className="space-y-1.5 text-xs">
              <p className="flex items-center gap-2 text-rose-400 font-semibold">
                <Phone className="w-3.5 h-3.5" /> 1800-BLOOD-24 (Toll-Free)
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> +91 724 243 5590 (Akola Red Cross)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> support@bloodbank.org
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Civil Hospital Campus, Medical District
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Blood Bank Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Healthcare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
