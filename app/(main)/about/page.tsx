'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedButton from '../../../components/AnimatedButton';

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-100 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About Luxoria
            </motion.h1>
            <motion.p
              className="max-w-2xl mx-auto text-xl text-gray-600 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Luxury redefined for the modern digital era, bringing premium products and experiences to your doorstep.
            </motion.p>
          </div>
        </div>
        <div className="absolute inset-x-0 -bottom-40 transform translate-y-1/3 z-0">
          <svg viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#4F46E5" 
              fillOpacity="0.05"
              d="M0,64L48,96C96,128,192,192,288,213.3C384,235,480,213,576,181.3C672,149,768,107,864,117.3C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Our Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              At Luxoria, we believe everyone deserves access to premium products that enhance their lifestyle. Our mission is to curate the finest selection of luxury goods and make them accessible through a seamless digital experience.
            </p>
            <p className="text-lg text-gray-600">
              Founded in 2023, we've quickly become a trusted destination for discerning customers who value quality, design, and excellent service.
            </p>
          </motion.div>
          <motion.div
            className="relative h-96 rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image 
              src="https://images.unsplash.com/photo-1541484019605-453dc7a6e1a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              alt="Luxury products on display"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
              unoptimized
            />
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gradient-to-r from-indigo-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality",
                description: "We never compromise on quality. Every product in our catalog undergoes rigorous quality assurance.",
                icon: (
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Innovation",
                description: "We're constantly exploring new technologies and designs to bring you the latest in luxury.",
                icon: (
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: "Sustainability",
                description: "We're committed to ethical sourcing and sustainability in every aspect of our business.",
                icon: (
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 text-indigo-600">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2 
          className="text-3xl font-bold text-center mb-16 text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Meet Our Team
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Alexandra Reynolds",
              position: "Founder & CEO",
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"
            },
            {
              name: "Michael Chen",
              position: "Creative Director",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
              name: "Sarah Johnson",
              position: "Head of Product",
              image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80"
            }
          ].map((person, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative h-64 w-64 mx-auto mb-4 overflow-hidden rounded-xl shadow-lg">
                <Image 
                  src={person.image}
                  alt={person.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{person.name}</h3>
              <p className="text-indigo-600">{person.position}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Want to learn more about Luxoria?
          </motion.h2>
          <motion.p 
            className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            We'd love to hear from you. Reach out to our team with any questions or feedback.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <AnimatedButton 
              variant="cyber"
              onClick={() => window.location.href = '/contact'}
              className="mr-4"
            >
              Contact Us
            </AnimatedButton>
            <AnimatedButton 
              variant="neon"
            >
              Join Our Newsletter
            </AnimatedButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 