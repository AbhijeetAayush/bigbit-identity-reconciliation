# 🚀 Bitespeed Identity Reconciliation Service

Welcome to the **Bitespeed Identity Reconciliation Service!** 🎉
This serverless API is like a super-smart assistant 🕵️‍♂️ for online stores, helping them figure out if a customer has shopped before by matching their email or phone number.

It keeps customer records clean, avoids duplicates, and gives businesses a clear view of their customers.

This README is written in simple, friendly words for everyone to understand, with fun emojis and interactive sections to make it easy to explore. It’s perfect for interviewers to test the API and see how it’s built! 🔍

---

## 📋 Table of Contents

* [🧐 What Is This App?](#-what-is-this-app)
* [📨 API Endpoints for Testing](#-api-endpoints-for-testing)
* [🧰 Tech Stack](#-tech-stack)
* [⚙️ How the Project Works](#️-how-the-project-works)

---

## 🧐 What Is This App?

This app is a **serverless API** that helps online stores keep track of customers. When someone shops, they might use different emails or phone numbers, but they’re still the same person.

The `/identify` API takes an email or phone number, checks a database, and:

* Finds if the customer already exists.
* Links new info to their record or creates a new one if they’re new.
* Returns a tidy summary of all their emails, phone numbers, and linked records.

### 📦 Example Request

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

### 🧾 Example Response

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["mcfly@hillvalley.edu", "lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}
```

---

## 🤔 Why Build This App?

This project solves the **identity reconciliation** problem from Bitespeed’s task. It helps e-commerce stores:

* Track repeat customers, even if they use different details.
* Avoid duplicate records, keeping the database clean.
* Improve customer service by recognizing who’s who.

---

## 🚀 Why This Approach?

We built it to be:

* ⚡ **Fast** – using caching (Upstash Redis)
* ☁️ **Scalable** – deployed as a serverless API via AWS SAM
* 🧼 **Maintainable** – with clear TypeScript code and tools

---

## 🛠️ API Endpoints for Testing

**Base URL:**
`https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify`

**Method:** `POST`
**Header:** `Content-Type: application/json`

---

### ✅ Test Case 1: Identify Existing Contact

```bash
curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "mcfly@hillvalley.edu", "phoneNumber": "123456"}'
```

**Expected Response:**

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["mcfly@hillvalley.edu", "lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}
```

---

### 🆕 Test Case 2: Identify New Contact

```bash
curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "new@hillvalley.edu", "phoneNumber": "789012"}'
```

**Expected Response:**

```json
{
  "contact": {
    "primaryContatctId": 3,
    "emails": ["new@hillvalley.edu"],
    "phoneNumbers": ["789012"],
    "secondaryContactIds": []
  }
}
```

---

### ❌ Test Case 3: Invalid Request (No Data)

```bash
curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**

```json
{
  "error": "Either email or phoneNumber is required"
}
```

---

### 📧 Test Case 4: Email Only

```bash
curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "test@hillvalley.edu"}'
```

**Expected Response:**

```json
{
  "contact": {
    "primaryContatctId": 4,
    "emails": ["test@hillvalley.edu"],
    "phoneNumbers": [],
    "secondaryContactIds": []
  }
}
```

---

### 📞 Test Case 5: Phone Number Only

```bash
curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "987654"}'
```

**Expected Response:**

```json
{
  "contact": {
    "primaryContatctId": 5,
    "emails": [],
    "phoneNumbers": ["987654"],
    "secondaryContactIds": []
  }
}
```

---

## ⚙️ Testing with Thunder Client (Optional)

1. Install [Thunder Client](https://www.thunderclient.com/) in VS Code.
2. Create a new collection: **"Bitespeed Identity Reconciliation"**
3. For each test case:

   * Method: `POST`
   * URL: `https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify`
   * Header: `Content-Type: application/json`
   * Body: Use the JSON snippets from above

Click **Send** and verify the responses match expectations.

---

## 🧰 Tech Stack

| Tool 🌟             | What It Does 📝                          | Why We Chose It 💡                                   |
| ------------------- | ---------------------------------------- | ---------------------------------------------------- |
| **TypeScript**      | Adds types to JavaScript                 | Prevents bugs and improves readability               |
| **AWS SAM**         | Serverless deployment framework          | Simplifies Lambda + API Gateway deployments          |
| **Supabase**        | Postgres-based database with REST & auth | Easy setup, great UI, fast querying                  |
| **Upstash Redis**   | Redis cache with REST API support        | Speeds up response times (used for deduping lookups) |
| **ESBuild**         | JavaScript bundler for Lambda            | Lightning fast, generates lightweight bundles        |
| **Jest**            | JavaScript testing framework             | Placeholder for test automation (to be expanded)     |
| **ESLint/Prettier** | Linting & formatting tools               | Keeps code clean and consistent                      |

---

## 🤝 Why This Stack?

It's like choosing the **best tools** for a clean, fast, and reliable API:

* **TypeScript** ensures type safety and code clarity.
* **AWS SAM** enables easy, cost-effective serverless deployment.
* **Supabase** offers a free-tier PostgreSQL DB that's fast and developer-friendly.
* **Upstash Redis** supercharges performance with a free, serverless cache.
* **ESBuild**, **Prettier**, and **ESLint** make the development experience seamless.

---

🌟 Feel free to fork, test, or build on top of this project.
For any questions or feedback, reach out — contributions are welcome!
