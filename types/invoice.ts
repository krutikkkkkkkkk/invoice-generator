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

export type InvoiceData = {
  documentType: "invoice" | "quotation"
  invoiceNumber: string
  date: Date
  dueDate: Date
  currency: string
  company: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
    phone: string
    email: string
    upiId?: string; // ✅ Add this

  }
  client: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
    phone: string
    email: string
  }
  items: {
    id: string
    description: string
    quantity: number
    price: number
    tax: number
  }[]
  notes: string
  terms: string
  taxRate: number
  banking?: {
    accountName: string
    accountNumber: string
    bankName: string
    ifscCode?: string
    swiftCode?: string
  }
  paymentOptions?: {
    paypalEmail?: string
    upiId?: string
    upiAmount?: number
    upiQrUrl?: string // base64 or image URL
  }



  
}



