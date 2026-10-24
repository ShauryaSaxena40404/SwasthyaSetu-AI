import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HealthcareService } from '../../types';
import { 
  Search, 
  ExternalLink, 
  Phone, 
  FileCheck, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { DisclaimerBadge } from '../common/DisclaimerBadge';

export const ServicesDirectory: React.FC = () => {
  const [services, setServices] = useState<HealthcareService[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<HealthcareService | null>(null);

  const categories = [
    'All',
    'Telemedicine',
    'Insurance & Financial Aid',
    'Medicine & Pharmacy',
    'Mental Health',
    'Maternal & Child'
  ];

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await api.getServices(searchQuery, selectedCategory);
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Verified Healthcare Schemes & Resources
            </h1>
            <DisclaimerBadge variant="verified" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Search verified government healthcare initiatives, telemedicine platforms, and affordable pharmacy networks across India. Every entry includes official verification dates and portal links.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes (e.g. Ayushman Bharat, generic medicine, 5 lakh insurance, telemedicine)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px] uppercase mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500">Querying verified government healthcare services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Matching Healthcare Services</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search terms or selecting another category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle hover:border-teal-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {svc.category}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1.5">{svc.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{svc.nameHindi}</p>
                  </div>

                  {svc.isVerified ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex-shrink-0">
                      Unverified
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {svc.description}
                </p>

                {/* Eligibility Excerpt */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Eligibility Criteria:
                  </p>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                    {svc.eligibility}
                  </p>
                </div>

                {/* Verification Date & Helpline */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Last Verified: <strong className="text-slate-700">{svc.lastVerifiedDate}</strong>
                  </span>

                  <span className="flex items-center gap-1 font-semibold text-teal-800">
                    <Phone className="w-3 h-3 text-teal-600" />
                    Helpline: {svc.helpline}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedService(svc)}
                  className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  View Required Documents & Steps
                </button>

                <a
                  href={svc.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedService.category}
                </span>
                <h3 className="font-black text-slate-900 text-lg mt-1">{selectedService.name}</h3>
                <p className="text-xs text-slate-500">{selectedService.nameHindi}</p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            {/* Verification Metadata */}
            <div className="flex flex-wrap items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified against official Ministry documentation</span>
              </div>
              <span className="font-semibold">Last Checked: {selectedService.lastVerifiedDate}</span>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Overview & Scope</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{selectedService.description}</p>
              <p className="text-xs text-teal-900 bg-teal-50 p-2.5 rounded-lg border border-teal-100 mt-2 font-medium">
                {selectedService.coverageDetails}
              </p>
            </div>

            {/* Eligibility */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Citizen Eligibility</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedService.eligibility}
              </p>
            </div>

            {/* Required Documents */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <span>Required Documentation</span>
              </h4>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                {selectedService.requiredDocuments.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>

            {/* Application Steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Application & Consultation Steps
              </h4>
              <div className="space-y-1.5">
                {selectedService.applicationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-800 border border-slate-100">
                    <span className="w-4 h-4 rounded-full bg-teal-700 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                <Phone className="w-4 h-4 text-teal-600" />
                <span>Toll-Free Helpline: {selectedService.helpline}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedService.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
