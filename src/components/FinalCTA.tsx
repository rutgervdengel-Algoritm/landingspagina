'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Breng helderheid in je wachtlijstbeheer
          </h2>
          <p className="mt-6 text-lg text-primary-100 max-w-2xl mx-auto">
            Start vandaag nog met WachtlijstHelderheid. 14 dagen gratis, geen creditcard nodig.
            Ontdek hoeveel tijd je bespaart.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-4 text-lg font-semibold"
            >
              Gratis starten
              <ArrowRight size={20} className="ml-2" />
            </a>
            <a
              href="#opvang"
              className="btn border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
            >
              Meer informatie
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
