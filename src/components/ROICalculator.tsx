'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Clock, Euro, TrendingUp } from 'lucide-react';

export default function ROICalculator() {
  const [locations, setLocations] = useState(3);
  const [waitlistSize, setWaitlistSize] = useState(100);

  const hoursPerWeek = Math.round(locations * 4);
  const hoursSaved = Math.round(hoursPerWeek * 0.8);
  const costPerHour = 35;
  const monthlySavings = Math.round(hoursSaved * 4 * costPerHour);
  const yearlySavings = monthlySavings * 12;

  return (
    <section className="py-20 bg-forest-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="badge bg-white/20 text-white mx-auto w-fit mb-4">
            <Calculator size={16} className="mr-1" />
            ROI Calculator
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
            Bereken je besparing
          </h2>
          <p className="mt-4 text-lg text-forest-200 max-w-2xl mx-auto">
            Ontdek hoeveel tijd en geld je bespaart met WachtlijstHelderheid.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-forest-700 rounded-2xl p-8 border border-forest-400/20">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-forest-200 mb-2">
                    Aantal locaties: <span className="text-white font-semibold">{locations}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={locations}
                    onChange={(e) => setLocations(Number(e.target.value))}
                    className="w-full h-2 bg-forest-500 rounded-lg appearance-none cursor-pointer accent-terracotta-500"
                  />
                  <div className="flex justify-between text-xs text-forest-300 mt-1">
                    <span>1</span>
                    <span>20</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-forest-200 mb-2">
                    Wachtlijstgrootte: <span className="text-white font-semibold">{waitlistSize}</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={10}
                    value={waitlistSize}
                    onChange={(e) => setWaitlistSize(Number(e.target.value))}
                    className="w-full h-2 bg-forest-500 rounded-lg appearance-none cursor-pointer accent-terracotta-500"
                  />
                  <div className="flex justify-between text-xs text-forest-300 mt-1">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-forest-500/40 rounded-2xl p-4 text-center">
                  <Clock size={24} className="text-teal-300 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{hoursSaved}u</p>
                  <p className="text-xs text-forest-200">uren bespaard / week</p>
                </div>
                <div className="bg-forest-500/40 rounded-2xl p-4 text-center">
                  <Euro size={24} className="text-teal-300 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">&euro;{monthlySavings}</p>
                  <p className="text-xs text-forest-200">besparing / maand</p>
                </div>
                <div className="col-span-2 bg-terracotta-500/30 rounded-2xl p-4 text-center">
                  <TrendingUp size={24} className="text-terracotta-300 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-terracotta-300">
                    &euro;{yearlySavings.toLocaleString('nl-NL')}
                  </p>
                  <p className="text-sm text-terracotta-200">geschatte jaarlijkse besparing</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
