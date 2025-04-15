import { Suspense } from "react";
import { InvoiceGenerator } from "@/components/invoice-generator";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="container mx-auto max-w">
          <header className="relative mb-8 text-left border-gray-200 border-2 rounded-lg p-6 bg-white shadow-sm flex justify-between items-start flex-wrap">
            <div className="text-content">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              💸 Invoice & Quotation Generator
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Create professional invoices and quotations effortlessly.
            </p>
            </div>
            <div className="flex mt-3 md:mt-0">
              <a
                href="https://infinitylinkage.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded bg-green-100 px-3 py-1 text-lg font-medium text-green-800 hover:bg-green-200"
              >
                Crafted by Infinity Linkage
              </a>
            </div>
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

