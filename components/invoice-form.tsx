"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { DocumentType, InvoiceData, LineItem } from "@/types/invoice"
import { CalendarIcon, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface InvoiceFormProps {
  documentType: DocumentType
  invoiceData: InvoiceData
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>
}

export function InvoiceForm({ documentType, invoiceData, setInvoiceData }: InvoiceFormProps) {
  const updateCompany = (field: string, value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value,
      },
    }))
  }

  const updateClient = (field: string, value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        [field]: value,
      },
    }))
  }

  const updateItem = (id: string, field: string, value: string | number) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const addItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      price: 0,
      tax: 0,
    }

    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeItem = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  const calculateTaxTotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price * (item.tax / 100), 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxTotal()
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">{documentType === "invoice" ? "Invoice" : "Quotation"} Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="invoiceNumber">{documentType === "invoice" ? "Invoice" : "Quotation"} Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={(e) =>
                  setInvoiceData((prev) => ({
                    ...prev,
                    invoiceNumber: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !invoiceData.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {invoiceData.date ? format(invoiceData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={invoiceData.date}
                    onSelect={(date) =>
                      setInvoiceData((prev) => ({
                        ...prev,
                        date: date || new Date(),
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {documentType === "invoice" && (
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !invoiceData.dueDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {invoiceData.dueDate ? format(invoiceData.dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={invoiceData.dueDate}
                      onSelect={(date) =>
                        setInvoiceData((prev) => ({
                          ...prev,
                          dueDate: date || new Date(),
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div>
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={invoiceData.taxRate}
                onChange={(e) =>
                  setInvoiceData((prev) => ({
                    ...prev,
                    taxRate: Number.parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Your Company</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={invoiceData.company.name}
                      onChange={(e) => updateCompany("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyAddress">Address</Label>
                    <Input
                      id="companyAddress"
                      value={invoiceData.company.address}
                      onChange={(e) => updateCompany("address", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyCity">City</Label>
                      <Input
                        id="companyCity"
                        value={invoiceData.company.city}
                        onChange={(e) => updateCompany("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyState">State</Label>
                      <Input
                        id="companyState"
                        value={invoiceData.company.state}
                        onChange={(e) => updateCompany("state", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="companyZip">ZIP Code</Label>
                    <Input
                      id="companyZip"
                      value={invoiceData.company.zip}
                      onChange={(e) => updateCompany("zip", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input
                      id="companyPhone"
                      value={invoiceData.company.phone}
                      onChange={(e) => updateCompany("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={invoiceData.company.email}
                      onChange={(e) => updateCompany("email", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Client Information</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={invoiceData.client.name}
                  onChange={(e) => updateClient("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={invoiceData.client.email}
                  onChange={(e) => updateClient("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Address</Label>
                <Input
                  id="clientAddress"
                  value={invoiceData.client.address}
                  onChange={(e) => updateClient("address", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Phone</Label>
                <Input
                  id="clientPhone"
                  value={invoiceData.client.phone}
                  onChange={(e) => updateClient("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientCity">City</Label>
                <Input
                  id="clientCity"
                  value={invoiceData.client.city}
                  onChange={(e) => updateClient("city", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientState">State</Label>
                <Input
                  id="clientState"
                  value={invoiceData.client.state}
                  onChange={(e) => updateClient("state", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientZip">ZIP Code</Label>
                <Input
                  id="clientZip"
                  value={invoiceData.client.zip}
                  onChange={(e) => updateClient("zip", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Items</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {invoiceData.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Label htmlFor={`item-${item.id}-desc`}>Description</Label>
                    <Input
                      id={`item-${item.id}-desc`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${item.id}-qty`}>Quantity</Label>
                    <Input
                      id={`item-${item.id}-qty`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${item.id}-price`}>Price</Label>
                    <Input
                      id={`item-${item.id}-price`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${item.id}-tax`}>Tax (%)</Label>
                    <Input
                      id={`item-${item.id}-tax`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={item.tax || invoiceData.taxRate}
                      onChange={(e) => updateItem(item.id, "tax", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1 pt-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={invoiceData.items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addItem}>
                Add Item
              </Button>

              <div className="mt-6 space-y-2 text-right">
                <div>
                  <span className="font-medium">Subtotal:</span> ${calculateSubtotal().toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Tax:</span> ${calculateTaxTotal().toFixed(2)}
                </div>
                <div className="text-lg font-bold">
                  <span>Total:</span> ${calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={4}
            value={invoiceData.notes}
            onChange={(e) => setInvoiceData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes to the client..."
          />
        </div>
        <div>
          <Label htmlFor="terms">Terms & Conditions</Label>
          <Textarea
            id="terms"
            rows={4}
            value={invoiceData.terms}
            onChange={(e) => setInvoiceData((prev) => ({ ...prev, terms: e.target.value }))}
            placeholder="Terms and conditions..."
          />
        </div>
      </div>
    </div>
  )
}

