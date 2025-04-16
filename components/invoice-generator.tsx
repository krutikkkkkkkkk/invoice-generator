"use client";

import { useEffect, useState } from "react";
import companies from "@/data/companies.json";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { DocumentType, InvoiceData } from "@/types/invoice";

interface InvoiceGeneratorProps {
  companyName: string; // Added companyName prop
}

export function InvoiceGenerator({ companyName }: InvoiceGeneratorProps) {
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState<any>(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [documentType, setDocumentType] = useState<DocumentType>("invoice");
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    documentType: "invoice",
    invoiceNumber: "",
    date: new Date(),
    dueDate: new Date(),
    currency: "USD",
    company: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      email: "",
      upiId: "",
    },
    client: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
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
    paymentOptions: {
      paypalEmail: "",
    },
    banking: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      swiftCode: "",
    },
  });

  useEffect(() => {
    if (companyName && companies[companyName as keyof typeof companies]) {
      const companyInfo = companies[companyName as keyof typeof companies];
      setCompanyData(companyInfo);
      setInvoiceData((prev) => ({
        ...prev,
        company: {
          name: companyInfo.name || prev.company.name,
          address: companyInfo.address || prev.company.address,
          city: companyInfo.city || prev.company.city,
          state: companyInfo.state || prev.company.state,
          zip: companyInfo.zip || prev.company.zip,
          country: companyInfo.country || prev.company.country,
          phone: companyInfo.phone || prev.company.phone,
          email: companyInfo.email || prev.company.email,
          upiId: companyInfo.upiId || prev.company.upiId,
        },
        paymentOptions: {
          ...prev.paymentOptions,
          paypalEmail: companyInfo.paypalEmail || prev.paymentOptions?.paypalEmail,
        },
      }));
    } else {
      setCompanyData(null);
    }
  }, [companyName]);

  const handleDownload = async () => {
    const element = document.getElementById("invoice-preview");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Increase scale for better clarity
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight() - 40; // Subtract 30mm for top and 30mm for bottom margins

      // Convert canvas height to mm and apply zoom factor
      const zoomFactor = 1.4; // Zoom factor for the image
      const imgWidth = pdfWidth * zoomFactor;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const canvasHeightMm = (canvas.height * imgWidth) / canvas.width;

      let yOffset = 0; // Start from the top of the content
      while (yOffset < canvasHeightMm) {
        // Calculate the visible height for the current page
        const visibleHeightMm = Math.min(canvasHeightMm - yOffset, pdfHeight);

        // Create a cropped canvas for the current page
        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = canvas.width;
        croppedCanvas.height = (visibleHeightMm * canvas.width) / imgWidth;

        const croppedContext = croppedCanvas.getContext("2d");
        if (croppedContext) {
          croppedContext.drawImage(
            canvas,
            0,
            (yOffset * canvas.width) / imgWidth, // Source Y position
            canvas.width,
            croppedCanvas.height, // Source height
            0,
            0,
            canvas.width,
            croppedCanvas.height // Destination height
          );
        }

        const croppedImgData = croppedCanvas.toDataURL("image/png");

        // Add the cropped image to the PDF
        pdf.addImage(
          croppedImgData,
          "PNG",
          (pdfWidth - imgWidth) / 2, // Center the image horizontally
          30, // Start 30mm from the top of the page
          imgWidth,
          visibleHeightMm
        );

        yOffset += visibleHeightMm; // Move to the next section of the content

        // Add a new page if there is more content
        if (yOffset < canvasHeightMm) {
          pdf.addPage();
        }
      }

      pdf.save(`${documentType}-${invoiceData.invoiceNumber || "draft"}.pdf`);

      toast({
        title: "Success!",
        description: `Your ${documentType} has been downloaded.`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-lg bg-white h-[max-content] p-4 shadow-md md:p-6 border-gray-200 border-2">
      <Tabs
        value={documentType}
        onValueChange={(value) => {
          setDocumentType(value as DocumentType);
          setInvoiceData((prev) => ({
            ...prev,
            documentType: value as DocumentType,
          }));
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
  );
}