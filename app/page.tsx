"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { InvoiceGenerator } from "@/components/invoice-generator";
import Footer from "@/components/footer";

function Content() {
  const searchParams = useSearchParams();
  const companyName = searchParams?.get("companyName") || "Default Company"; // Use "Default Company" if no param is provided

  return (
    <>
      <header className="relative mb-10 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-8 flex flex-col md:flex-row justify-between items-start">
          <div className="text-content mb-6 md:mb-0">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">💸</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Invoice & Quotation Generator
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-lg">
              Create professional, customized invoices and quotations in minutes.
            </p>
          </div>
          <div>
            <a
              href="https://infinitylinkage.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-green-300 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium"
            >
              <span>Crafted by Infinity Linkage</span>
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        {/* Pass the company name from the URL parameter to prefill company details */}
        <InvoiceGenerator companyName={companyName} />
      </Suspense>
    </>
  );
}

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="container mx-auto max-w">
          <Suspense fallback={<div>Loading...</div>}>
            <Content />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

