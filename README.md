# ⚡ Salesforce Attribute Pricing Automation

![Banner](./salesforce_automation_banner.png)

> **Effortlessly automate the creation of complex pricing adjustments in Salesforce.**

This automation suite creates complex **Attribute Based Adjustments** in Salesforce, handling modal navigation, dropdown selections, and calendar pickers. It has been supercharged to process massive volumes (like 100 products × 200 combinations = 20,000 records) using parallel processing.

---

## 🚀 Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Playwright](https://playwright.dev/)

### 2. Installation

Clone the repository and install dependencies:

```bash
npm install
npx playwright install chromium
```

### 3. Configuration

1. **Credentials:** 
   Open the `.env` file and enter your Salesforce credentials. The scripts use this to automatically log you in without requiring manual intervention.
   ```env
   SF_USERNAME=your_username@salesforce.com
   SF_PASSWORD=your_password
   ```

2. **Products List:**
   Open `products.txt` and ensure all the products you want to process are listed, one per line.

---

## 🛠️ Usage

You have two ways to generate records. The **CSV Method** is highly recommended for speed.

### Method A: Parallel UI Automation Orchestrator

This method opens 5 Chrome windows simultaneously and distributes the products from `products.txt` across them.

1. **Run the orchestrator:**
   ```bash
   node orchestrator.js
   ```
2. **Auto-Login:** 
   The browsers will launch, detect the login screen, and automatically fill in your `.env` credentials.
3. **Smart Resume:** 
   If you ever need to stop the script (Ctrl+C), just run it again! The script reads all `creation_log_*.txt` files and automatically skips any product combination that was already successfully completed.

### Method B: CSV Generation (Lightning Fast ⚡)

UI automation takes about ~1 minute per record. If you have 20,000 records, it will take days even with parallel processing. Use this method to create them in 2 minutes.

1. **Run the generator:**
   ```bash
   node generateCSV.js
   ```
2. **Import:**
   A file named `AttributeBasedAdjustments.csv` will be instantly created with all 20,000 rows perfectly formatted. Use **Salesforce Data Loader** or **Data Import Wizard** to upload it.

---

## 📊 Combinations Logic

The scripts iterate through the following attributes for every single product:

| Attribute              | Values                                |
| :--------------------- | :------------------------------------ |
| **Max No of Cabinets** | 10, 50, 100, 200, 400, 600, 800, 1000 |
| **Draw Caps**          | 3 kVA, 4 kVA, 5 kVA, 6 kVA, 7 kVA     |
| **CBE Bands**          | 2 – 3, 3 – 4, 4 – 5, 5 – 6, 6 – 7     |

**Total per Product:** 8 × 5 × 5 = **200 Records**

---

## 📝 Logging

To prevent file-writing conflicts, each parallel worker writes to its own log file:
- `creation_log_1.txt`
- `creation_log_2.txt`
- etc.

Example:
`[5/15/2026, 10:26:42 AM] SUCCESS - Record 1/200: Product: Shared Cage, PSM: Term Based - Monthly...`

---

## 🛡️ Features

- **Parallel Orchestration:** Run 5 browsers at once.
- **Auto-Login:** Automatically bypasses Salesforce login using `.env`.
- **Smart Queue & Resumption:** Reads all log files and skips any work that was already done, making it 100% safe to stop and restart.
- **Persistent Context:** Saves your login session in `./salesforce-profile-X` folders.
- **Dynamic Selectors:** Specifically built to handle Salesforce's complex Lightning UI.

---

Developed for Salesforce Productivity.
Created by **Sukanya** & **AJu**
