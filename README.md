🚀 Bitespeed Identity Reconciliation Service

Welcome to the Bitespeed Identity Reconciliation Service! 🎉 This is a super cool serverless API that acts like a detective 🕵️‍♂️ for online stores, figuring out if a customer has shopped before by matching their email or phone number. It keeps customer records neat, avoids duplicates, and gives businesses a clear picture of who their customers are. This README is written in simple, friendly words with lots of emojis to make it fun and easy to understand for everyone, including non-tech folks. It’s packed with details for interviewers to test the API and explore how it’s built! 🔍
📋 Table of Contents

What Is This App?
API Endpoints for Testing
Tech Stack: What We Used & Why
How the Project Works: The Flow

🌟 What Is This App?
Imagine you run an online store 🏬, and a customer buys something using their email, like mcfly@hillvalley.edu. Later, they use a different email but the same phone number, 123456. How do you know it’s the same person? 🤔 That’s where this app comes in! The /identify API:

Checks a database to see if the email or phone number is already known.
Links new info to an existing customer or creates a new record if they’re new.
Returns a tidy summary of all their emails, phone numbers, and linked records.

For example:

You send: { "email": "mcfly@hillvalley.edu", "phoneNumber": "123456" }
The API checks if this customer exists. If they do, it adds the new info to their record. If not, it makes a new one.
You get back a JSON with all their details, like:{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["mcfly@hillvalley.edu", "lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}



Why is this useful?This app solves the identity reconciliation problem from Bitespeed’s task. It helps online stores:

Track repeat customers across purchases, even if they use different details.
Avoid duplicate records, keeping the database clean.
Improve customer service by recognizing who’s who, making shopping smoother.

Why build it this way?We wanted a fast, scalable, and easy-to-use solution that’s reliable for businesses and simple for developers to maintain. The app uses modern tools to achieve this, and it’s live for you to test! 🚀
🛠️ API Endpoints for Testing
The API is live at https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify 🎉. It accepts POST requests with an email and/or phone number to identify customers. Below are test cases you can try using curl, Postman, or Thunder Client (a VS Code extension). Each case includes the request body, what it does, and the expected response.
Test Case 1: Identify Existing Contact ✅

Request:curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
     -H "Content-Type: application/json" \
     -d '{"email": "mcfly@hillvalley.edu", "phoneNumber": "123456"}'


What It Does: Checks if the email or phone number exists in the database. If found, it links them to the existing customer; if not, it creates a new record.
Expected Response (Status: 200 OK):{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["mcfly@hillvalley.edu", "lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}


Note: If it’s a new contact, expect only one email/phone and an empty secondaryContactIds array.



Test Case 2: Identify New Contact 🆕

Request:curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
     -H "Content-Type: application/json" \
     -d '{"email": "new@hillvalley.edu", "phoneNumber": "789012"}'


What It Does: Creates a new customer record if no matches are found.
Expected Response (Status: 200 OK):{
  "contact": {
    "primaryContatctId": 3,
    "emails": ["new@hillvalley.edu"],
    "phoneNumbers": ["789012"],
    "secondaryContactIds": []
  }
}



Test Case 3: Invalid Request 🚫

Request:curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
     -H "Content-Type: application/json" \
     -d '{}'


What It Does: Tests error handling when neither email nor phone number is provided.
Expected Response (Status: 400 Bad Request):{
  "error": "Either email or phoneNumber is required"
}



Test Case 4: Email Only 📧

Request:curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
     -H "Content-Type: application/json" \
     -d '{"email": "test@hillvalley.edu"}'


What It Does: Handles cases with only an email, linking or creating a record.
Expected Response (Status: 200 OK):{
  "contact": {
    "primaryContatctId": 4,
    "emails": ["test@hillvalley.edu"],
    "phoneNumbers": [],
    "secondaryContactIds": []
  }
}



Test Case 5: Phone Only 📞

Request:curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "987654"}'


What It Does: Handles cases with only a phone number, linking or creating a record.
Expected Response (Status: 200 OK):{
  "contact": {
    "primaryContatctId": 5,
    "emails": [],
    "phoneNumbers": ["987654"],
    "secondaryContactIds": []
  }
}



How to Test with Thunder Client:

Install Thunder Client in VS Code.
Create a collection: Bitespeed Identity Reconciliation.
Add each test case:
Method: POST
URL: https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify
Header: Content-Type: application/json
Body: Copy the JSON from above.


Click Send and check the responses.

Why These Test Cases?They cover all possible scenarios:

Linking existing customers.
Creating new customers.
Handling errors and partial inputs.
Interviewers can test the API directly without any setup, showing it’s robust and reliable.

🔧 Tech Stack: What We Used & Why
We chose tools that make the app fast, scalable, and easy to work with. Here’s a table explaining each one:



Tool 🌟
What It Does 📝
Why We Chose It 💡



TypeScript
Adds rules to JavaScript to catch mistakes.
Prevents bugs, makes code easier to read, and helps teams work together.


AWS SAM
Deploys apps on AWS without managing servers.
Easy setup, auto-scales with traffic, and keeps costs low.


Supabase
A database to store customer info.
Simple to use, free tier for testing, and super fast for searches.


Upstash Redis
A fast cache for saving API responses.
Speeds up responses (~3ms) by skipping database calls for repeated requests.


ESBuild
Bundles code for AWS Lambda.
Lightning-fast and makes small code packages for quick deployment.


Jest
Tests code (placeholder for now).
Ready for adding tests to ensure everything works perfectly.


ESLint/Prettier
Keeps code neat and consistent.
Makes code look clean and easy to understand for everyone.


Why This Stack?It’s like picking the best tools for a job:

TypeScript and ESLint/Prettier keep the code safe and tidy.
AWS SAM and Supabase make setup and scaling a breeze.
Upstash Redis makes the API super fast for users.
ESBuild and Jest ensure the app is efficient and ready for testing.

🔄 How the Project Works: The Flow
Imagine you’re a store owner, and a customer named Marty shops on your website. He uses his email mcfly@hillvalley.edu and phone 123456. Here’s how the API handles it, step by step, in a humanized way:

Marty Sends His Info 🧑‍💼:

Marty sends a request to the API: { "email": "mcfly@hillvalley.edu", "phoneNumber": "123456" }.
The request hits AWS API Gateway, which is like the front door of our app, listening at https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify.


The Doorman Checks the Request 🚪:

The Lambda function (src/identify/app.ts) is like a doorman who checks Marty’s ID.
It makes sure the request has at least an email or phone number. If not, it says, “Sorry, I need some info!” and sends back an error (400 Bad Request).


The Librarian Looks for Marty 📚:

The doorman hands Marty’s info to the reconciliation manager (src/reconciliation/app.ts), who’s like a librarian.
The librarian first checks a fast notebook (Upstash Redis) to see if Marty’s info is already saved. The notebook uses a special code (hash) to find his record quickly.
If found, the librarian grabs it in a flash (~3ms) and sends it back. Done! ⚡


Digging Deeper in the Library 🔍:

If the notebook doesn’t have Marty’s info, the librarian goes to the big library (Supabase database, src/services/contactService.ts).
The library has a table called contact with all customer records, organized with columns like id, phonenumber, email, and linkprecedence.
The librarian searches for Marty’s email or phone number:
If found: Links any new info (e.g., a new email) to Marty’s existing record, marking it as a secondary contact if needed.
If not found: Creates a new record for Marty as a “primary” contact.


If multiple records claim to be primary, the librarian picks the oldest one and updates others to point to it.


Saving for Next Time 📝:

The librarian writes Marty’s updated info in the fast notebook (Redis) so it’s ready for next time.
The notebook keeps it for 1 hour to avoid checking the big library again.


Sending Back Marty’s Details 📬:

The librarian sends back a neat summary to Marty, like:{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["mcfly@hillvalley.edu", "lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}


This tells the store all of Marty’s emails, phone numbers, and linked records.



Why This Flow?It’s like a well-run store:

Fast: The notebook (Redis) saves time for repeat customers.
Organized: The library (Supabase) keeps data tidy and accurate.
Flexible: Handles new customers, existing ones, or partial info.
Scalable: Can manage tons of customers without slowing down, thanks to AWS.

How It Feels:

For customers: They’re recognized instantly, making shopping seamless.
For developers: The code is easy to understand and build on.
For businesses: No duplicate records, saving time and money.

Next Steps for Interviewers 👨‍🏫

Test the API: Use the curl commands above to try different scenarios.
Check the Code: Explore the GitHub repo to see how it’s built.
Ask Questions: Want to know more about why we chose something? I’m happy to explain!

Submission 📩

GitHub: The code is in a public repository:git add .
git commit -m "Complete Bitespeed Identity Reconciliation project"
git push origin main


API URL: https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify
Submit: Share the repo URL and API URL via Bitespeed Google Form.

Why Submit This Way?  

The repo shows the code’s quality.
The live API lets you test it instantly.

Future Ideas 💡

Add tests with Jest to double-check the code.
Use Supabase Realtime to update the cache automatically.
Add a queue (SQS) for handling lots of requests.
Track errors with Sentry for better debugging.

Why Improve?These upgrades would make the app even stronger for real-world use, handling more customers and catching issues faster.
