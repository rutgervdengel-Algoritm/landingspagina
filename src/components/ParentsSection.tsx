'use client';

import { motion } from 'framer-motion';
import { Heart, Eye, Bell, Smartphone } from 'lucide-react';

export default function ParentsSection() {
  return (
    <section id="ouders" className="py-20 bg-gradient-to-b from-secondary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge bg-secondary-100 text-secondary-600 w-fit mb-4">
              <Heart size={16} className="mr-1" />
              Voor ouders
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
              Eindelijk <span className="text-secondary-500">duidelijkheid</span> over je
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
                  <div className="flex-shrink-0 w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <item.icon size={20} className="text-secondary-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900">{item.title}</h4>
                    <p className="text-sm text-navy-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#pricing" className="btn-secondary btn-lg mt-8 inline-flex">
              Gratis aanmelden als ouder
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl border border-navy-200 p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-navy-400">Jouw wachtlijstpositie</p>
                <p className="text-6xl font-bold text-secondary-500 mt-2">#4</p>
                <p className="text-sm text-navy-500 mt-1">van de 28 aanmeldingen</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-navy-50 rounded-lg">
                  <span className="text-sm text-navy-600">Locatie</span>
                  <span className="text-sm font-medium text-navy-800">KDV De Zonnetjes</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-navy-50 rounded-lg">
                  <span className="text-sm text-navy-600">Gewenste startdatum</span>
                  <span className="text-sm font-medium text-navy-800">Augustus 2025</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-navy-600">Verwachte plaatsing</span>
                  <span className="text-sm font-medium text-success">Juni 2025</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <p className="text-xs text-primary-700">
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
