import { InvoiceGenerator } from "@/components/invoice-generator"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">Invoice & Quotation Generator</h1>
        <InvoiceGenerator />
      </div>
    </main>
    <Footer/>
    </>
  )
}

