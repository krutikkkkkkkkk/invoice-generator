# 🧾 Invoice Generator

## 🌟 Overview
The **Invoice Generator** is a sleek and intuitive web-based tool designed to streamline the creation of professional invoices. Whether you're a freelancer, small business owner, or corporate professional, this tool helps you generate invoices effortlessly with customizable fields and prefilled data options.

---

## ✨ Features
- 🖥️ **User-Friendly Interface**: Generate invoices with ease.
- 🔗 **Prefilled Data via URL**: Automate invoice creation with pre-configured links.
- 🛠️ **Customizable Fields**: Tailor invoices to your specific needs.
- ⚡ **Fast and Efficient**: Save time with a streamlined workflow.

---

## 🔗 Prefilled URL Functionality
The application supports prefilled data through URL parameters, enabling you to prepopulate invoice fields directly from a link. This feature is perfect for automation or sharing ready-to-use invoice templates.

### 📝 Example URL
```
http://localhost:3000/?companyName=Infinity%20Linkage&companyEmail=hello%40infinitylinkage.com&companyPhone=%2B918788383600&companyState=Gujarat&paypalEmail=krutik%40infinitylinkage.com&upiId=infinitylinkage%40oneyes&companyCountry=India
```

### 🛠️ Supported Query Parameters
| Parameter       | Description                          |
|------------------|--------------------------------------|
| `companyName`    | Name of the company                 |
| `companyEmail`   | Email address of the company        |
| `companyPhone`   | Phone number of the company         |
| `companyState`   | State where the company is located  |
| `companyCountry` | Country where the company is located|
| `paypalEmail`    | PayPal email for receiving payments |
| `upiId`          | UPI ID for receiving payments       |

### 🚀 How to Use
1. Replace the values in the example URL with your own data.
2. Open the URL in your browser.
3. The invoice form will be prefilled with the provided data, ready for customization or download.

---

## 🛠️ Getting Started
Follow these steps to set up and run the Invoice Generator locally:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Development Server**:
   ```bash
   npm start
   ```
4. **Access the Application**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📜 License
This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it as per the terms of the license.

---

## 💡 Contributing
Contributions are welcome! If you'd like to improve this project, please fork the repository, make your changes, and submit a pull request.

---

## 📞 Contact
For any questions or feedback, feel free to reach out:
- **Email**: hello@infinitylinkage.com
- **Phone**: +91 8788383600
