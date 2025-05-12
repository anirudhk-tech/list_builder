"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <>
      <main className="relative flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-x-hidden font-sans">
        <Navbar />

        <section className="container mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-800">
              <h1 className="text-4xl font-extrabold">Terms & Conditions</h1>
            </div>

            {/* PDF Embed */}
            <div className="h-[100vh] overflow-y-scroll">
              <object
                data="/tos.pdf"
                type="application/pdf"
                width="100%"
                height="100%"
                className="block"
              >
                <div className="p-6 text-center">
                  <p>Your browser doesn’t support embedded PDFs.</p>
                  <a
                    href="/tos.pdf"
                    className="mt-4 inline-block text-red-500 underline"
                  >
                    Download the Terms & Conditions
                  </a>
                </div>
              </object>
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>

      <style jsx>{`
        /* optional: customize scrollbar */
        .overflow-y-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-scroll::-webkit-scrollbar-track {
          background: #1f1f1f;
        }
        .overflow-y-scroll::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}
