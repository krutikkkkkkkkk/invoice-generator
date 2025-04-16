import { format } from "date-fns";
import type { InvoiceData } from "@/types/invoice";
import { QRCodeSVG } from "qrcode.react";

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

export function InvoicePreview({ invoiceData }: InvoicePreviewProps) {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: invoiceData.currency || "USD",
  });

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateTaxTotal = () => {
    return invoiceData.items.reduce(
      (sum, item) => sum + item.quantity * item.price * (item.tax / 100),
      0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxTotal();
  };

  const calculateItemTotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  return (
    <div
      id="invoice-preview"
      className="w-full max-w-4xl mx-auto bg-white text-gray-800"
      style={{
        fontSize: "14px",
        lineHeight: "1.6",
        aspectRatio: "1 / 1.414",
      }}
    >
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            {invoiceData.documentType === "invoice" ? "INVOICE" : "QUOTATION"}
          </h1>
          {invoiceData.invoiceNumber && (
            <p className="text-gray-500 mt-1">#{invoiceData.invoiceNumber}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold">{invoiceData.company.name}</p>
          <div className="text-gray-600 space-y-1 mt-2">
            <p>{invoiceData.company.address}</p>
            <p>
              {invoiceData.company.city}, {invoiceData.company.state} {invoiceData.company.zip}
            </p>
            <p>{invoiceData.company.country}</p>
            <p>{invoiceData.company.phone}</p>
            <p>{invoiceData.company.email}</p>
          </div>
        </div>
      </div>

      {/* Client and Date Section */}
      <div className="mb-12 grid grid-cols-2 gap-8 pb-8 border-b border-gray-200">
        <div>
          <h2 className="mb-4 text-lg font-medium text-gray-600">Bill To</h2>
          <p className="font-medium text-lg text-gray-900">{invoiceData.client.name}</p>
          <div className="text-gray-600 space-y-1 mt-2">
            <p>{invoiceData.client.address}</p>
            <p>
              {invoiceData.client.city}, {invoiceData.client.state} {invoiceData.client.zip}
            </p>
            <p>{invoiceData.client.country}</p>
            <p>{invoiceData.client.phone}</p>
            <p>{invoiceData.client.email}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-4">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium ml-2">{invoiceData.date ? format(invoiceData.date, "MMMM dd, yyyy") : ""}</span>
          </div>
          {invoiceData.documentType === "invoice" && (
            <div>
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium ml-2">{invoiceData.dueDate ? format(invoiceData.dueDate, "MMMM dd, yyyy") : ""}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10">
        <div className="overflow-hidden rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-200">
                <th className="py-3 px-4 font-medium text-gray-600">Description</th>
                <th className="py-3 px-4 text-right font-medium text-gray-600">Qty</th>
                <th className="py-3 px-4 text-right font-medium text-gray-600">Price</th>
                <th className="py-3 px-4 text-right font-medium text-gray-600">Tax</th>
                <th className="py-3 px-4 text-right font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="py-3 px-4 text-right">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">
                    {currencyFormatter.format(item.price)}
                  </td>
                  <td className="py-3 px-4 text-right">{item.tax}%</td>
                  <td className="py-3 px-4 text-right font-medium">
                    {currencyFormatter.format(calculateItemTotal(item.quantity, item.price))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Calculation */}
      <div className="mb-10 flex justify-end">
        <div className="w-64 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between py-2 text-gray-600">
            <span>Subtotal:</span>
            <span>{currencyFormatter.format(calculateSubtotal())}</span>
          </div>
          <div className="flex justify-between py-2 text-gray-600 border-t border-gray-200">
            <span>Tax:</span>
            <span>{currencyFormatter.format(calculateTaxTotal())}</span>
          </div>
          <div className="flex justify-between py-2 font-semibold text-xl border-t border-gray-200">
            <span>Total:</span>
            <span>{currencyFormatter.format(calculateTotal())}</span>
          </div>
        </div>
      </div>

      {/* Notes and Terms Section */}
      {(invoiceData.notes || invoiceData.terms) && (
        <div className="mb-10 grid grid-cols-2 gap-8 text-gray-600">
          {invoiceData.notes && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="mb-2 font-medium text-gray-800">Notes</h2>
              <p>{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="mb-2 font-medium text-gray-800">Terms & Conditions</h2>
              <p>{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}

      {/* Payment Information Section */}
      {(invoiceData.banking || invoiceData.paymentOptions) && (
        <div className="mb-10 p-4 bg-gray-50 rounded-lg">
          <h2 className="mb-4 font-medium text-gray-800">Payment Information</h2>

          {invoiceData.banking && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="text-gray-500">Bank:</span> {invoiceData.banking.bankName}</p>
                <p><span className="text-gray-500">Account Name:</span> {invoiceData.banking.accountName}</p>
                <p><span className="text-gray-500">Account Number:</span> {invoiceData.banking.accountNumber}</p>
              </div>
              <div>
                {invoiceData.banking.ifscCode && <p><span className="text-gray-500">IFSC:</span> {invoiceData.banking.ifscCode}</p>}
                {invoiceData.banking.swiftCode && <p><span className="text-gray-500">SWIFT:</span> {invoiceData.banking.swiftCode}</p>}
              </div>
            </div>
          )}

          {invoiceData.paymentOptions?.paypalEmail && (
            <p className="mt-4">
              <span className="text-gray-500">PayPal:</span> {invoiceData.paymentOptions.paypalEmail}
            </p>
          )}

          {invoiceData.currency === "INR" && invoiceData.company.upiId && (
            <div className="mt-6 flex flex-row items-center gap-6 justify-center">
              <div>
                <h3 className="mb-2 font-medium">Pay via UPI</h3>
                <p className="text-gray-500 text-sm">{invoiceData.company.upiId}</p>
              </div>
              <QRCodeSVG
                value={`upi://pay?pa=${invoiceData.company.upiId || ""}&pn=${encodeURIComponent(
                  invoiceData.company.name || ""
                )}&am=${calculateTotal().toFixed(2)}&cu=INR`}
                size={120}
                includeMargin={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Footer Section */}
      <div className="text-sm text-gray-500 mt-10 border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between">
        <div>
          <p>
            <span className="font-medium">Digitally Signed:</span> This document is electronically generated by {invoiceData.company.name}.
          </p>
          <p className="mt-1">
            <span className="font-medium">Generated On:</span>{" "}
            {format(new Date(), "MMMM dd, yyyy")}
          </p>
        </div>
        <div className="mt-2 md:mt-0 md:text-right">
          <p>
            <span className="font-medium">Questions?</span> Contact us at{" "}
            <a href={`mailto:${invoiceData.company.email}`} className="text-blue-600 hover:underline">
              {invoiceData.company.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}