# 💳 CrediSure – Smart Micro Loan Management App

CrediSure is a **secure, responsive micro-loan management platform** built with **Django (backend)** and **React (frontend)**.  
It’s designed to streamline the loan application and approval process between **borrowers** and **admins**, ensuring transparency, security, and simplicity — all within a single web and mobile-friendly interface.

---

## 🚀 Tech Stack

**Frontend:** React.js  
**Backend:** Python Django REST Framework  
**Authentication:** JWT (JSON Web Tokens) + Email OTP Verification  
**Database:** Mysql 
**Email Service:** Gmail SMTP  
**UI Framework:** Tailwind CSS / Bootstrap (as preferred)

---

## 🧩 Core Features

### 🔐 Authentication & Access Control
- JWT-based secure login system  
- Email OTP verification for both **Admin** and **Borrower** during login  
- Separate login portals for **Admin** and **Borrower**  
- **Only Admin** can create accounts for borrowers using a **unique registration code**

### 💼 Loan Management Workflow
1. **Borrower** applies for a loan through a simple online form.  
2. Application includes details like **amount, purpose, duration**, and **KYC documents (Aadhaar & PAN)**.  
3. Upon submission, an **email notification** (with borrower & KYC details) is sent to the **Admin**.  
4. **Admin** can **approve** or **reject** the loan request via the dashboard.  
5. Borrower receives an **email update** instantly once the loan status changes.

### 🧾 Admin Dashboard
- View and manage all loan applications  
- Approve/Reject borrower requests  
- Access borrower KYC and contact details  
- Manage borrower accounts

### 👤 Borrower Dashboard
- Apply for a new loan  
- Track loan application status  
- Update profile and documents  
- Receive notifications on approval/rejection
- Change Password

---

## 📱 Mobile Responsive Design
- Fully optimized for both **desktop** and **mobile** views  
- Smooth, user-friendly interface for quick actions and visibility

---

