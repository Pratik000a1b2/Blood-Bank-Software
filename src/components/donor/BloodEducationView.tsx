import React from 'react';
import {
  Heart,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle,
  Activity,
  Droplet,
} from 'lucide-react';

export const BloodEducationView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Blood Donation Information & Guidelines
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Evidence-based facts, physiological eligibility criteria, and donation preparation protocols
        </p>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Medical Notice:</strong> Information provided here is intended for educational purposes only. Final donor eligibility, hemoglobin thresholds (minimum 12.5 g/dL), and screening criteria must always be confirmed in person with qualified healthcare and blood bank personnel prior to phlebotomy.
        </div>
      </div>

      {/* Grid of Core Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Who Can Donate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Who Can Donate Blood?</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Age:</strong> Between 18 and 65 years of age.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Weight:</strong> At least 45 kg (or 50 kg for double red cell donations).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Hemoglobin:</strong> Minimum 12.5 g/dL for both men and women.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>General Health:</strong> Normal blood pressure, pulse (60–100 bpm), and no active fever or antibiotic treatments.</span>
            </li>
          </ul>
        </div>

        {/* 2. Health Benefits */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Benefits of Blood Donation</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Saves Up to 3 Lives:</strong> A single whole blood unit can be separated into red cells, platelets, and plasma.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Complimentary Mini-Health Check:</strong> Checks blood pressure, pulse, hemoglobin, and screens for viral markers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Stimulates Hematopoiesis:</strong> Encourages bone marrow to generate fresh, healthy erythrocytes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Psychological Wellness:</strong> Giving altruistically enhances social connectedness and sense of purpose.</span>
            </li>
          </ul>
        </div>

        {/* 3. The 4-Step Process */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
            <span>The Blood Donation Process</span>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <strong className="text-slate-800">1. Registration:</strong> Photo ID verification and digital medical questionnaire completion (approx. 5 mins).
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <strong className="text-slate-800">2. Medical Examination:</strong> Confidential check of vitals, hemoglobin finger prick, and temperature.
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <strong className="text-slate-800">3. Phlebotomy (Donation):</strong> Sterile, single-use needle collection of 350ml or 450ml of blood (takes 8–10 minutes).
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <strong className="text-slate-800">4. Recovery & Refreshment:</strong> 10–15 minutes rest with fruit juice, biscuits, and hydration.
            </div>
          </div>
        </div>

        {/* 4. Donation Frequency & Intervals */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
            <span>How Often Can a Person Donate?</span>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              The human body replaces lost fluid volume within 24–48 hours, while red blood cells are regenerated over 4–8 weeks.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-center">
                <span className="block text-slate-400 text-[10px]">MALE DONORS</span>
                <span className="font-bold text-slate-900 text-sm">Every 3 Months</span>
                <span className="text-[10px] text-slate-500">(Up to 4 times a year)</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-center">
                <span className="block text-slate-400 text-[10px]">FEMALE DONORS</span>
                <span className="font-bold text-slate-900 text-sm">Every 4 Months</span>
                <span className="text-[10px] text-slate-500">(Up to 3 times a year)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              *Platelet donors (apheresis) can donate more frequently, up to 24 times per year under specialized clinical supervision.
            </p>
          </div>
        </div>
      </div>

      {/* Before & After Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Before Donating Blood (Checklist)
          </h4>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Drink 500ml of water or hydrating fluids 30–60 minutes prior.</li>
            <li>Eat a light, nutritious meal; avoid donating on an empty stomach.</li>
            <li>Avoid fatty or greasy food 4 hours before donation (can affect lipid tests).</li>
            <li>Get a solid night's rest (at least 6–8 hours of sleep).</li>
            <li>Bring a government-issued photo identity proof (Aadhaar, Driving License, Voter ID).</li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            After Donating Blood (Care & Precautions)
          </h4>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Keep the bandage on your arm for at least 4–6 hours.</li>
            <li>Drink extra fluids throughout the remainder of the day.</li>
            <li>Avoid strenuous physical exercise, heavy lifting, or gym workouts for 24 hours.</li>
            <li>If you feel lightheaded, sit down or lie down with your feet elevated.</li>
            <li>Avoid alcohol consumption and smoking for at least 6 hours following donation.</li>
          </ul>
        </div>
      </div>

      {/* Universal Compatibility Matrix */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Droplet className="w-4 h-4 text-rose-600 fill-rose-600" />
          Blood Group Compatibility Chart
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Blood Type</th>
                <th className="py-2.5 px-3">Can Donate Red Cells To</th>
                <th className="py-2.5 px-3">Can Receive Red Cells From</th>
                <th className="py-2.5 px-3">Clinical Characteristic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="py-2 px-3 font-bold text-rose-700">O-</td>
                <td className="py-2 px-3 text-slate-800">All Blood Types (Universal Donor)</td>
                <td className="py-2 px-3 text-slate-800">O- only</td>
                <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">Critical in emergency trauma when type is unknown</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-rose-700">O+</td>
                <td className="py-2 px-3 text-slate-800">O+, A+, B+, AB+</td>
                <td className="py-2 px-3 text-slate-800">O+, O-</td>
                <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">Most transfused blood type in hospital care</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-rose-700">A+</td>
                <td className="py-2 px-3 text-slate-800">A+, AB+</td>
                <td className="py-2 px-3 text-slate-800">A+, A-, O+, O-</td>
                <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">Second most prevalent population group</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-rose-700">A-</td>
                <td className="py-2 px-3 text-slate-800">A+, A-, AB+, AB-</td>
                <td className="py-2 px-3 text-slate-800">A-, O-</td>
                <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">Valuable for rh-negative patients</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-rose-700">B+</td>
                <td className="py-2 px-3 text-slate-800">B+, AB+</td>
                <td className="py-2 px-3 text-slate-800">B+, B-, O+, O-</td>
                <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">Highly requested in South Asian populations</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-rose-700">B-</td>
                <td className="py-2 px-3 text-slate-800">B+, B-, AB+, AB-</td>
                <td className="py-2 px-3 text-slate-800">B-, O-</td>
                <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">Rare blood group (less than 2% of population)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-rose-700">AB+</td>
                <td className="py-2 px-3 text-slate-800">AB+ only</td>
                <td className="py-2 px-3 text-slate-800">All Blood Types (Universal Recipient)</td>
                <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">Can safely receive red cells from any donor</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-rose-700">AB-</td>
                <td className="py-2 px-3 text-slate-800">AB+, AB-</td>
                <td className="py-2 px-3 text-slate-800">AB-, A-, B-, O-</td>
                <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">Rarest group (less than 1% of population)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
