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
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-cream-100">
      {/* Decorative teal curved line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-100,300 C200,100 400,500 700,250 C1000,0 1200,400 1540,200"
          stroke="#5BA89D"
          strokeWidth="3"
          fill="none"
        />
      </svg>

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

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-forest-600 leading-tight">
              Het mooiste dat een kind kan worden, is{' '}
              <span className="relative inline-block">
                <span className="relative z-10">zichzelf</span>
                <svg
                  className="absolute -bottom-2 -left-2 -right-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -top-2 z-0"
                  viewBox="0 0 200 80"
                  preserveAspectRatio="none"
                >
                  <ellipse
                    cx="100"
                    cy="40"
                    rx="95"
                    ry="35"
                    fill="none"
                    stroke="#5BA89D"
                    strokeWidth="2"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-navy-500 max-w-xl">
              Geef ouders real-time inzicht in hun wachtlijstpositie en automatiseer
              communicatie. Bespaar tijd, verminder frustratie.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="#pricing" className="btn-primary btn-lg">
                Vrijblijvend inschrijven
                <ArrowRight size={20} className="ml-2" />
              </a>
              <a
                href="#opvang"
                className="btn-outline btn-lg"
              >
                Rondleiding aanvragen
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {trustBullets.map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-forest-500">
                  <item.icon size={20} className="text-teal-500" />
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
            <div className="bg-white rounded-2xl shadow-xl border border-cream-300 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-terracotta-400" />
                <div className="w-3 h-3 rounded-full bg-terracotta-300" />
                <div className="w-3 h-3 rounded-full bg-teal-400" />
                <span className="ml-2 text-sm text-navy-400">Dashboard</span>
              </div>
              <div className="space-y-3">
                <div className="bg-cream-100 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-forest-600">Actieve wachtlijsten</span>
                    <span className="text-2xl font-bold text-forest-500">24</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-cream-50 rounded-xl p-3">
                    <p className="text-xs text-navy-400">Nieuwe aanmeldingen</p>
                    <p className="text-xl font-bold text-forest-600">156</p>
                    <p className="text-xs text-teal-600">+12% deze week</p>
                  </div>
                  <div className="bg-cream-50 rounded-xl p-3">
                    <p className="text-xs text-navy-400">Geplaatst deze maand</p>
                    <p className="text-xl font-bold text-forest-600">38</p>
                    <p className="text-xs text-teal-600">+8% deze maand</p>
                  </div>
                </div>
                <div className="bg-cream-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-forest-600 mb-2">Recente activiteit</p>
                  {['Emma de Vries - Positie #3 → #2', 'Liam Jansen - Nieuw aangemeld', 'Sophie Bakker - Geplaatst!'].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-2 py-1.5 text-sm text-navy-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
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
