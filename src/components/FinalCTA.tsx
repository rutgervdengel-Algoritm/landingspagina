'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 bg-forest-600 relative overflow-hidden">
      {/* Decorative teal curves */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1440 400"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-100,200 C200,50 500,350 800,150 C1100,-50 1300,300 1540,100"
          stroke="#5BA89D"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge bg-white/20 text-white mx-auto w-fit mb-6">
            <Sparkles size={16} className="mr-1" />
            Klaar om te starten?
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white">
            Breng helderheid in je wachtlijstbeheer
          </h2>
          <p className="mt-6 text-lg text-forest-200 max-w-2xl mx-auto">
            Start vandaag nog met WachtlijstHelderheid. 14 dagen gratis, geen creditcard nodig.
            Ontdek hoeveel tijd je bespaart.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="btn bg-terracotta-500 text-white hover:bg-terracotta-600 px-8 py-4 text-lg font-semibold rounded-full"
            >
              Vrijblijvend inschrijven
              <ArrowRight size={20} className="ml-2" />
            </a>
            <a
              href="#opvang"
              className="btn border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full"
            >
              Rondleiding aanvragen
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
