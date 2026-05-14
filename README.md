# ⚡ Salesforce Attribute Pricing Automation

![Banner](./salesforce_automation_banner.png)

> **Effortlessly automate the creation of complex pricing adjustments in Salesforce.**

This script automates the tedious process of creating **200 unique combinations** of Attribute Based Adjustments in Salesforce, handling modal navigation, dropdown selections, and calendar pickers.

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

Open `createAttributePricing.js` and update the following constants if needed:

- `URL`: The Salesforce Price Adjustment Schedule view URL.
- `PRODUCT`, `PRODUCT_SELLING_MODEL`, etc.

---

## 🛠️ Usage

1. **Run the script:**

   ```bash
   node createAttributePricing.js
   ```

2. **Login:**
   A browser window will open. Log in to your Salesforce account manually.

3. **Authorize:**
   Once logged in, go back to your terminal and **press ENTER**.

4. **Automation Flow:**
   The script will iterate through all 200 combinations.
   - It **automatically clicks "New"** in the Attribute Based Adjustment section for each record.
   - The script fills both Page 1 (Product info) and Page 2 (Attribute values) automatically.

---

## 📊 Combinations Logic

The script iterates through the following attributes to generate 200 records:

| Attribute              | Values                                |
| :--------------------- | :------------------------------------ |
| **Max No of Cabinets** | 10, 50, 100, 200, 400, 600, 800, 1000 |
| **Draw Caps**          | 3 kVA, 4 kVA, 5 kVA, 6 kVA, 7 kVA     |
| **CBE Bands**          | 2 – 3, 3 – 4, 4 – 5, 5 – 6, 6 – 7     |

**Total:** 8 × 5 × 5 = **200 Records**

---

## 📝 Logging

All successful creations are logged in real-time to:
`creation_log.txt`

Example:
`[14/5/2026, 5:26:42 pm] SUCCESS - Record 1/200: Product: Shared Cage, PSM: Term Based - Monthly...`

## ⏱️ Performance & Efficiency

Based on real-time execution logs, the automation achieves significant time savings:

- **Average Time per Record:** ~1 Minute 8 Seconds
- **Total Records:** 200
- **Total Automation Time:** ~3.8 Hours
- **Estimated Manual Time:** ~16.5 Hours (at 5 mins/record)
- **Efficiency Gain:** **>75% Time Saved** 🚀

The script allows for hands-free creation of complex pricing grids, ensuring 100% data accuracy across all 200 combinations.

---

## 🛡️ Features

- **Persistent Context:** Saves your login session in `./salesforce-profile` so you don't have to log in every time.
- **Dynamic Selectors:** Specifically built to handle Salesforce's complex Lightning UI.
- **Auto-Wait:** Intelligent wait times to handle Salesforce server processing.

---

Developed for Salesforce Productivity.
Created by **Sukanya** & **AJu**
