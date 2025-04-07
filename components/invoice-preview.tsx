import { format } from "date-fns"
import type { InvoiceData } from "@/types/invoice"

interface InvoicePreviewProps {
  invoiceData: InvoiceData
}

export function InvoicePreview({ invoiceData }: InvoicePreviewProps) {
  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  const calculateTaxTotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price * (item.tax / 100), 0)
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
          {invoiceData.invoiceNumber && <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>}
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
                <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                <td className="py-2 text-right">{item.tax}%</td>
                <td className="py-2 text-right">${calculateItemTotal(item.quantity, item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between border-b border-gray-200 py-2">
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 py-2">
            <span>Tax:</span>
            <span>${calculateTaxTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
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
    </div>
  )
}

