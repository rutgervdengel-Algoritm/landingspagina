'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Shield, Clock, Users } from 'lucide-react';

const trustBullets = [
  { icon: Clock, text: 'Bespaar 12 uur per week' },
  { icon: Users, text: '100+ opvanglocaties' },
  { icon: Shield, text: 'AVG-compliant' },
];

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge-green mb-6">
              <CheckCircle size={16} className="mr-1" />
              Nieuw: Automatische wachtlijst-matching
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
              Wachtlijstbeheer dat{' '}
              <span className="text-primary-600">helderheid</span> biedt
            </h1>

            <p className="mt-6 text-lg md:text-xl text-navy-500 max-w-xl">
              Geef ouders real-time inzicht in hun wachtlijstpositie en automatiseer
              communicatie. Bespaar tijd, verminder frustratie.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="#pricing" className="btn-primary btn-lg">
                Gratis starten
                <ArrowRight size={20} className="ml-2" />
              </a>
              <a
                href="#opvang"
                className="btn bg-white text-navy-700 border border-navy-300 hover:bg-navy-50 px-8 py-4 text-lg"
              >
                Bekijk demo
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {trustBullets.map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-navy-600">
                  <item.icon size={20} className="text-primary-600" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-navy-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-sm text-navy-400">Dashboard</span>
              </div>
              <div className="space-y-3">
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-navy-800">Actieve wachtlijsten</span>
                    <span className="text-2xl font-bold text-primary-600">24</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-navy-50 rounded-lg p-3">
                    <p className="text-xs text-navy-400">Nieuwe aanmeldingen</p>
                    <p className="text-xl font-bold text-navy-800">156</p>
                    <p className="text-xs text-success">+12% deze week</p>
                  </div>
                  <div className="bg-navy-50 rounded-lg p-3">
                    <p className="text-xs text-navy-400">Geplaatst deze maand</p>
                    <p className="text-xl font-bold text-navy-800">38</p>
                    <p className="text-xs text-success">+8% deze maand</p>
                  </div>
                </div>
                <div className="bg-navy-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-navy-700 mb-2">Recente activiteit</p>
                  {['Emma de Vries - Positie #3 → #2', 'Liam Jansen - Nieuw aangemeld', 'Sophie Bakker - Geplaatst!'].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-2 py-1.5 text-sm text-navy-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
