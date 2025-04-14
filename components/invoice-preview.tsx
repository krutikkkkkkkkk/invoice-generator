import { format } from "date-fns"
import type { InvoiceData } from "@/types/invoice"
import {QRCodeSVG} from "qrcode.react"


interface InvoicePreviewProps {
  invoiceData: InvoiceData
}

export function InvoicePreview({ invoiceData }: InvoicePreviewProps) {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: invoiceData.currency || "USD",
  })

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  const calculateTaxTotal = () => {
    return invoiceData.items.reduce(
      (sum, item) => sum + item.quantity * item.price * (item.tax / 100),
      0
    )
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxTotal()
  }

  const calculateItemTotal = (quantity: number, price: number) => {
    return quantity * price
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase">
            {invoiceData.documentType === "invoice" ? "INVOICE" : "QUOTATION"}
          </h1>
          {invoiceData.invoiceNumber && (
            <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-bold">{invoiceData.company.name}</p>
          <p>{invoiceData.company.address}</p>
          <p>
            {invoiceData.company.city}, {invoiceData.company.state} {invoiceData.company.zip}
          </p>
          <p>{invoiceData.company.phone}</p>
          <p>{invoiceData.company.email}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Bill To:</h2>
          <p className="font-medium">{invoiceData.client.name}</p>
          <p>{invoiceData.client.address}</p>
          <p>
            {invoiceData.client.city}, {invoiceData.client.state} {invoiceData.client.zip}
          </p>
          <p>{invoiceData.client.phone}</p>
          <p>{invoiceData.client.email}</p>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <span className="font-semibold">Date: </span>
            {invoiceData.date ? format(invoiceData.date, "MMMM dd, yyyy") : ""}
          </div>
          {invoiceData.documentType === "invoice" && (
            <div>
              <span className="font-semibold">Due Date: </span>
              {invoiceData.dueDate ? format(invoiceData.dueDate, "MMMM dd, yyyy") : ""}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 text-left">
              <th className="pb-2">Description</th>
              <th className="pb-2 text-right">Qty</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Tax</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2">{item.description}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">
                  {currencyFormatter.format(item.price)}
                </td>
                <td className="py-2 text-right">{item.tax}%</td>
                <td className="py-2 text-right">
                  {currencyFormatter.format(calculateItemTotal(item.quantity, item.price))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between border-b border-gray-200 py-2">
            <span>Subtotal:</span>
            <span>{currencyFormatter.format(calculateSubtotal())}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 py-2">
            <span>Tax:</span>
            <span>{currencyFormatter.format(calculateTaxTotal())}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold">
            <span>Total:</span>
            <span>{currencyFormatter.format(calculateTotal())}</span>
          </div>
        </div>
      </div>

      {(invoiceData.notes || invoiceData.terms) && (
        <div className="mb-8 grid grid-cols-2 gap-8">
          {invoiceData.notes && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Notes:</h2>
              <p className="text-gray-700">{invoiceData.notes}</p>
            </div>
          )}
          {invoiceData.terms && (
            <div>
              <h2 className="mb-2 text-lg font-semibold">Terms & Conditions:</h2>
              <p className="text-gray-700">{invoiceData.terms}</p>
            </div>
          )}
        </div>
      )}
      {(invoiceData.banking || invoiceData.paymentOptions) && (
  <div className="mb-8">
    <h2 className="mb-2 text-lg font-semibold">Payment Information</h2>

    {invoiceData.banking && (
      <div className="mb-4 text-sm text-gray-700">
        <p><strong>Bank:</strong> {invoiceData.banking.bankName}</p>
        <p><strong>Account Name:</strong> {invoiceData.banking.accountName}</p>
        <p><strong>Account Number:</strong> {invoiceData.banking.accountNumber}</p>
        {invoiceData.banking.ifscCode && <p><strong>IFSC:</strong> {invoiceData.banking.ifscCode}</p>}
        {invoiceData.banking.swiftCode && <p><strong>SWIFT:</strong> {invoiceData.banking.swiftCode}</p>}
      </div>
    )}

    {invoiceData.paymentOptions?.paypalEmail && (
      <p className="mb-2 text-sm text-gray-700">
        <strong>PayPal:</strong> {invoiceData.paymentOptions.paypalEmail}
      </p>
    )}

{invoiceData.currency === "INR" && invoiceData.company.upiId && (
  <div className="mt-8 flex flex-col items-center">
    <h2 className="mb-2 text-lg font-semibold">Pay via UPI</h2>
    <QRCodeSVG
      value={`upi://pay?pa=${invoiceData.company.upiId || ""}&pn=${encodeURIComponent(
        invoiceData.company.name || ""
      )}&am=${calculateTotal().toFixed(2)}&cu=INR`}
      size={160}
      includeMargin={true}
    />
    <p className="mt-2 text-sm text-gray-600">{invoiceData.company.upiId}</p>
  </div>
)}


  </div>
)}
   
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>This invoice have been digitally signed by {invoiceData.company.name} and is valid without a signature.</p>
        <p>For any queries, please contact us at {invoiceData.company.email}</p>
        <p>Generated on {format(new Date(), "MMMM dd, yyyy")}</p>
      </div>
    </div>
  )
}
