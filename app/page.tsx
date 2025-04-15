import { Suspense } from "react";
import { InvoiceGenerator } from "@/components/invoice-generator";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="relative mb-8 text-left border-gray-200 border-2 rounded-lg p-6 bg-white shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              💸 Invoice & Quotation Generator
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Create professional invoices and quotations effortlessly.
            </p>
            <a
              href="https://infinitylinkage.com"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 rounded bg-green-100 px-3 py-1 text-lg font-medium text-green-800 hover:bg-green-200"
            >
              Crafted by Infinity Linkage
            </a>
          </header>
          <Suspense fallback={<div>Loading...</div>}>
            <InvoiceGenerator />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

