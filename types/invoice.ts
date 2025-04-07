export type DocumentType = "invoice" | "quotation"

export interface Company {
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  price: number
  tax: number
}

export interface InvoiceData {
  documentType: DocumentType
  invoiceNumber: string
  date: Date
  dueDate: Date
  company: Company
  client: Company
  items: LineItem[]
  notes: string
  terms: string
  taxRate: number
}

