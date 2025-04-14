"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceForm } from "@/components/invoice-form"
import { InvoicePreview } from "@/components/invoice-preview"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import type { DocumentType, InvoiceData } from "@/types/invoice"

export function InvoiceGenerator() {
  const { toast } = useToast()
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const [documentType, setDocumentType] = useState<DocumentType>("invoice")
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    documentType: "invoice",
    invoiceNumber: "",
    date: new Date(),
    dueDate: new Date(),
    currency: "USD", // 🆕 Added currency here
    company: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
    },
    client: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
    },
    items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        price: 0,
        tax: 0,
      },
    ],
    notes: "",
    terms: "",
    taxRate: 0,
  })

  const handleDownload = async () => {
    const element = document.getElementById("invoice-preview")
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${documentType}-${invoiceData.invoiceNumber || "draft"}.pdf`)

      toast({
        title: "Success!",
        description: `Your ${documentType} has been downloaded.`,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md md:p-6">
      <Tabs
        value={documentType}
        onValueChange={(value) => {
          setDocumentType(value as DocumentType)
          setInvoiceData((prev) => ({
            ...prev,
            documentType: value as DocumentType,
          }))
        }}
      >
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="quotation">Quotation</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-6 flex justify-between">
        <Button variant={mode === "edit" ? "default" : "outline"} onClick={() => setMode("edit")}>
          Edit
        </Button>
        <Button variant={mode === "preview" ? "default" : "outline"} onClick={() => setMode("preview")}>
          Preview
        </Button>
      </div>

      {mode === "edit" ? (
        <InvoiceForm
          documentType={documentType}
          invoiceData={invoiceData}
          setInvoiceData={setInvoiceData}
        />
      ) : (
        <div>
          <div className="mb-6">
            <Button onClick={handleDownload}>Download as PDF</Button>
          </div>
          <div id="invoice-preview" className="bg-white p-8">
            <InvoicePreview invoiceData={invoiceData} />
          </div>
        </div>
      )}
    </div>
  )
}
