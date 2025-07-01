Bitespeed Identity Reconciliation Service
Welcome to the Bitespeed Identity Reconciliation Service! This project is a serverless API that helps businesses identify and connect customer records using their email or phone number. Think of it as a smart assistant that keeps track of customers, ensuring no duplicate records and giving a clear view of their details. This README is written in simple terms for anyone to understand, including non-technical folks, and includes everything needed to explore the project and test the API.
What Does This Project Do?
When a customer shops online, they might use different emails or phone numbers, but they’re still the same person. This project’s /identify API takes an email or phone number, checks a database, and either links the information to an existing customer or creates a new record. It returns a neat summary with all known emails, phone numbers, and linked contact IDs.
For example:

Send { "email": "mcfly@hillvalley.edu", "phoneNumber": "123456" }.
If the customer exists, the API links the new info and returns all their details.
If they’re new, it creates a fresh record.

This keeps customer data organized, helping businesses provide a better experience by recognizing returning customers.
Why This Project?
The project solves the identity reconciliation problem for Bitespeed, as outlined in their task. It’s useful for e-commerce platforms to:

Track repeat customers across purchases.
Avoid duplicate customer records.
Improve customer service by knowing who’s who.

Tech Stack: What We Used and Why
We picked tools that are modern, fast, and easy to manage. Here’s what we used and why:



Technology
What It Does
Why We Chose It



TypeScript
A language that adds rules to JavaScript to catch mistakes early.
Makes code safer and easier to maintain, especially for teams.


AWS SAM
A tool to build and deploy apps on AWS without managing servers.
Simplifies setup, scales automatically, and keeps costs low.


Supabase
A database (like PostgreSQL) to store customer info.
Easy to use, free tier for testing, and supports fast searches.


Upstash Redis
A super-fast cache to store API responses temporarily.
Speeds up the API by avoiding repeated database calls (~3ms response time).


ESBuild
Bundles code for AWS Lambda.
Fast and creates small, efficient code for serverless apps.


Jest
A testing tool (not fully used yet).
Ready for adding tests to ensure the code works as expected.


ESLint/Prettier
Keeps code tidy and consistent.
Makes the code easy to read and maintain for everyone.


Why This Stack?

It’s fast: Redis caching and Supabase indexes make responses quick.
It’s scalable: AWS SAM handles traffic spikes without extra work.
It’s developer-friendly: TypeScript and Supabase are easy to set up and use.

Project Structure: How It’s Organized
The project is organized like a well-arranged toolbox, with each file having a specific job:
bitespeed-identity-reconciliation/
├── api/
│   └── backend-api.yaml         # Defines the API structure for AWS
├── src/
│   ├── identify/
│   │   └── app.ts              # Handles incoming API requests
│   ├── reconciliation/
│   │   └── app.ts              # Checks cache and calls database
│   ├── services/
│   │   ├── supabaseClient.ts   # Connects to Supabase database
│   │   ├── redisClient.ts      # Connects to Upstash Redis cache
│   │   └── contactService.ts   # Manages customer data (search, add, update)
│   ├── types/
│   │   └── model.d.ts          # Defines data shapes for TypeScript
│   └── utils/
│       ├── cache.ts            # Handles caching with Redis
│       ├── error.ts            # Defines error types
│       ├── logger.ts           # Logs messages for debugging
│       ├── validator.ts        # Checks API inputs
│       └── hash.ts             # Creates unique cache keys
├── scripts/
│   └── initdb.sql              # Sets up the Supabase database
├── .gitignore                  # Ignores files we don’t want in Git
├── package.json                # Lists tools and scripts
├── tsconfig.json               # Configures TypeScript
├── template.yaml               # Defines AWS resources
├── README.md                   # This guide

Why This Structure?

Clear Jobs: Each file does one thing (e.g., app.ts for API, contactService.ts for database), making it easy to fix or add features.
Team-Friendly: Separating logic (API, database, cache) helps multiple developers work together.
Scalable: Adding new endpoints or features is straightforward.

How It Works: Architecture

Click to expand: How the API processes a request

When you send a POST request to the API:

API Gateway: Catches the request (https://hlidc410o7.../identify) and sends it to the Lambda function.
Lambda Function (src/identify/app.ts):
Checks if the request has an email or phone number.
Passes the request to reconciliation/app.ts.


Reconciliation (src/reconciliation/app.ts):
Checks Upstash Redis for a cached answer (using a unique key).
If found, returns it instantly (~3ms).
If not, asks Supabase for the data.


Supabase (src/services/contactService.ts):
Searches the contact table for matching email or phone number.
Creates a new record if no match, or links to an existing one.
Combines all related emails and phone numbers into one response.


Redis Caching (src/utils/cache.ts):
Saves the response in Redis for 1 hour to speed up future requests.


Response: Returns a JSON object with all customer details.

Why This Flow?

Fast: Caching skips slow database calls for repeated requests.
Reliable: Supabase ensures data is stored safely and accurately.
Scalable: AWS handles any number of requests without crashing.

Setup: Getting Started

Click to expand: How to set up the project

Prerequisites

Node.js 18+: For running code and installing tools. Download.
AWS CLI: For deploying to AWS. Install.
SAM CLI: For building serverless apps. Install.
Supabase Account: Sign up at Supabase.
Upstash Account: Sign up at Upstash.
VS Code: For editing and testing with Thunder Client.

Step 1: Clone the Project
git clone <your-repository-url>
cd bitespeed-identity-reconciliation
npm install

Why? This sets up the project and installs tools like TypeScript and Supabase libraries.
Step 2: Set Up Supabase

Log in to Supabase Dashboard.
Create a project (e.g., name: bitespeed-identity, region: us-east-1).
In SQL Editor, run scripts/initdb.sql to create the database table:CREATE TABLE public.contact (
  id SERIAL PRIMARY KEY,
  phonenumber VARCHAR(50),
  email VARCHAR(255),
  linkedid INTEGER,
  linkprecedence VARCHAR(10) CHECK (linkprecedence IN ('primary', 'secondary')),
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedat TIMESTAMP,
  FOREIGN KEY (linkedid) REFERENCES public.contact(id)
);

CREATE INDEX idx_contact_email ON public.contact (email) WHERE email IS NOT NULL;
CREATE INDEX idx_contact_phone ON public.contact (phonenumber) WHERE phonenumber IS NOT NULL;


Get your Project URL and Anon Key from Settings > API (you’ll need these for deployment).

Why? Supabase stores customer data, and the table setup ensures fast searches.
Step 3: Set Up Upstash Redis

Log in to Upstash Console.
Create a database (e.g., bitespeed-redis, region: us-east-1).
Get the REST API URL and Token from Details > REST API.
Test connectivity:redis-cli --tls -u redis://default:<your-token>@<your-database>.upstash.io:6379
ping


Should return PONG.



Why? Redis caches responses to make the API lightning-fast.
Step 4: Build the App

Check Code: Ensure no errors.npm run compile


Format Code: Keep it clean.npm run lint


Bundle Code: Prepare for AWS.npm run build


Prepare for Deployment:sam build



Why? These steps make sure the code is correct and ready for AWS.
Step 5: Deploy to AWS

Run:sam deploy --guided


Answer prompts:
Stack Name: bitespeed-identity-reconciliation
Region: us-east-1
Parameters: Enter your Supabase URL, Supabase Anon Key, Upstash REST URL, and Upstash Token when prompted.
Confirm changes: Yes
Allow IAM role creation: Yes (for permissions)
Save arguments: Yes (optional, for faster redeployments)


Note the API URL: https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/

Why? SAM sets up the API and Lambda function, and manual credential input keeps sensitive info secure.


Testing the API: For Interviewers

Click to expand: How to test the API

The API is live at https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify. It accepts POST requests with an email and/or phone number to identify customers. Below are test cases to try with curl, Postman, or Thunder Client.
Test Case 1: Identify Existing Contact

Request:curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
     -H "Content-Type: application/json" \
     -d '{"email": "mcfly@hillvalley.edu", "phoneNumber": "123456"}'


What It Does: Checks if the email or phone exists, links them, or creates a new record.
Expected Response (Status: 200 OK):{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["mcfly@hillvalley.edu", "lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}


If new, expect only one email/phone and no secondary IDs.



Test Case 2: Identify New Contact

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



Test Case 3: Invalid Request

Request:curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
     -H "Content-Type: application/json" \
     -d '{}'


What It Does: Tests error handling for missing inputs.
Expected Response (Status: 400 Bad Request):{
  "error": "Either email or phoneNumber is required"
}



Test Case 4: Email Only

Request:curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
     -H "Content-Type: application/json" \
     -d '{"email": "test@hillvalley.edu"}'


What It Does: Handles cases with only an email.
Expected Response (Status: 200 OK):{
  "contact": {
    "primaryContatctId": 4,
    "emails": ["test@hillvalley.edu"],
    "phoneNumbers": [],
    "secondaryContactIds": []
  }
}



Using Thunder Client:

Install Thunder Client in VS Code.
Create a collection: Bitespeed Identity Reconciliation.
Add requests with the above details (Method: POST, URL: https://hlidc410o7.../identify, Header: Content-Type: application/json, Body: JSON).
Send and verify responses.

Why These Tests?

They show the API can handle new customers, existing customers, partial inputs, and errors correctly.
Interviewers can test without setup, as the API is live.

Monitoring and Debugging

Click to expand: How to check if it’s working


AWS CloudWatch:

Go to AWS Console > CloudWatch > Log Groups > /aws/lambda/id-reconci-IdentifyFunction-AIzvGDvCQDle.
Look for INFO logs like Created new primary contact or Cache hit.
Check for ERROR logs if something goes wrong.


Supabase Dashboard:

Check Table Editor > public > contact for customer data.
Use Reports > API to monitor query performance.


Upstash Console:

Check Data Browser for cached keys (e.g., identify:<hash>).
Monitor Metrics for cache hit rates and speed.



Why Monitor?

Confirms the API is working and performing well.
Helps spot issues like slow queries or cache misses.

Performance Optimizations

Click to expand: How we made it fast


Redis Caching: Saves responses for 1 hour, making repeated requests super fast (~3ms).
Supabase Indexes: Speeds up searches for emails and phone numbers.
Lambda Settings: Uses 256MB memory and optimized code for quick responses.
API Gateway Caching: Can be enabled to cache responses for 60 seconds.

Why Optimize?

Fast responses make customers happy.
Saves money by reducing database and server usage.

Troubleshooting

Click to expand: Common issues and fixes


500 Internal Server Error:
Check CloudWatch logs for details.
Verify Supabase table (public.contact) and permissions.
Ensure credentials were entered correctly during deployment.


400 Bad Request:
Make sure the request includes email or phoneNumber.


Slow Responses:
Enable API Gateway caching or schedule Lambda warm-ups (every 5 minutes).


Deprecation Warning:
A punycode warning in logs is safe to ignore but can be fixed by updating dependencies.



Why Troubleshoot?

Keeps the API reliable and ready for real users.
Shows interviewers the project handles errors well.

Submission

GitHub: Push to a public repository:git add .
git commit -m "Complete Bitespeed Identity Reconciliation project"
git push origin main


API URL: https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify
Submit: Share the repository URL and API URL via Bitespeed Google Form.

Why Submit This Way?

The public repo lets interviewers see the code.
The live API URL allows them to test it easily.

Future Improvements

Add tests with Jest to check the code automatically.
Use Supabase Realtime to update the cache when data changes.
Add a queue (SQS) to handle lots of requests at once.
Integrate Sentry to track errors better.

Why Improve?

Makes the app even more reliable and ready for big businesses.
