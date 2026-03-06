'use client';

import { motion } from 'framer-motion';
import { Heart, Eye, Bell, Smartphone } from 'lucide-react';

export default function ParentsSection() {
  return (
    <section id="ouders" className="py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge bg-terracotta-100 text-terracotta-700 w-fit mb-4">
              <Heart size={16} className="mr-1" />
              Voor ouders
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-600">
              Eindelijk <span className="text-terracotta-500">duidelijkheid</span> over je
              wachtlijstpositie
            </h2>
            <p className="mt-4 text-lg text-navy-500">
              Geen onzekerheid meer. WachtlijstHelderheid geeft je real-time inzicht in waar
              je kind staat — volledig gratis.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Eye,
                  title: 'Transparant',
                  text: 'Bekijk je actuele positie op elk moment.',
                },
                {
                  icon: Bell,
                  title: 'Proactief',
                  text: 'Ontvang meldingen bij wijzigingen.',
                },
                {
                  icon: Smartphone,
                  title: 'Toegankelijk',
                  text: 'Werkt op elk apparaat, altijd bereikbaar.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-terracotta-100 rounded-xl flex items-center justify-center">
                    <item.icon size={20} className="text-terracotta-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-forest-600">{item.title}</h4>
                    <p className="text-sm text-navy-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#pricing" className="btn-primary btn-lg mt-8 inline-flex">
              Gratis aanmelden als ouder
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl border border-cream-300 p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-navy-400">Jouw wachtlijstpositie</p>
                <p className="text-6xl font-serif font-bold text-terracotta-500 mt-2">#4</p>
                <p className="text-sm text-navy-500 mt-1">van de 28 aanmeldingen</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-cream-50 rounded-xl">
                  <span className="text-sm text-navy-500">Locatie</span>
                  <span className="text-sm font-medium text-forest-600">KDV De Zonnetjes</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-cream-50 rounded-xl">
                  <span className="text-sm text-navy-500">Gewenste startdatum</span>
                  <span className="text-sm font-medium text-forest-600">Augustus 2025</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-teal-50 rounded-xl">
                  <span className="text-sm text-navy-500">Verwachte plaatsing</span>
                  <span className="text-sm font-medium text-teal-600">Juni 2025</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-teal-50 rounded-xl">
                <p className="text-xs text-teal-700">
                  Laatste update: 2 uur geleden — Je bent 1 positie gestegen!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
