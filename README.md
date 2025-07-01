Bitespeed Identity Reconciliation Service

Welcome to the Bitespeed Identity Reconciliation Service! This is a serverless API that helps online stores figure out if a customer has shopped before by matching their email or phone number. It’s like a clever librarian who organizes customer records so there are no duplicates, giving businesses a clear picture of each customer. This README is written in simple language for everyone to understand and is designed to be interactive, with sections you can expand and test cases for interviewers to try.
Table of Contents

What Does This Project Do?
Why This Project?
Tech Stack
Project Structure
How It Works: Architecture
Setup Instructions
Testing the API: For Interviewers
Monitoring and Debugging
Performance Optimizations
Troubleshooting
Submission
Future Improvements

What Does This Project Do?
Imagine a customer buys something from an online store using their email or phone number. Later, they use a different email but the same phone number. This API, called /identify, checks if they’re the same person by looking up their details in a database. It either connects the new info to their existing record or creates a new one if they’re new. The API then sends back a summary of all their emails, phone numbers, and linked records.
Example:

You send: { "email": "mcfly@hillvalley.edu", "phoneNumber": "123456" }
If they’re known, it links the info and returns all their details.
If they’re new, it makes a new record.

This keeps customer data neat, helping stores avoid duplicates and recognize returning customers.
Why This Project?
This project solves the identity reconciliation problem for Bitespeed, as described in their task. It’s great for online stores because it:

Tracks repeat customers across different purchases.
Prevents duplicate records in the database.
Makes customer service better by knowing who’s who.

Tech Stack

Click to expand: What tools we used and why

We chose modern, reliable tools to build a fast and scalable API. Here’s what we used:



Tool
What It Does
Why We Chose It



TypeScript
Adds rules to JavaScript to catch errors early.
Keeps code safe and easy to fix, great for team projects.


AWS SAM
Builds and deploys apps on AWS without servers.
Easy to set up, scales with traffic, and saves money.


Supabase
A database to store customer info.
Simple to use, has a free tier, and searches data quickly.


Upstash Redis
A fast cache for saving API responses.
Makes the API super fast (~3ms) by avoiding database calls for repeated requests.


ESBuild
Bundles code for AWS Lambda.
Quick and makes small, efficient code for serverless apps.


Jest
A tool for testing code (not fully used yet).
Ready for tests to ensure everything works.


ESLint/Prettier
Keeps code neat and consistent.
Makes code easy to read and maintain for everyone.


Why This Stack?

Speed: Redis and Supabase make responses fast.
Scalability: AWS SAM handles lots of users without extra work.
Ease: TypeScript and Supabase are beginner-friendly and quick to set up.

Project Structure

Click to expand: How the project is organized

The project is like a tidy toolbox, with each file doing one job:
bitespeed-identity-reconciliation/
├── api/
│   └── backend-api.yaml         # Sets up the API structure for AWS
├── src/
│   ├── identify/
│   │   └── app.ts              # Handles API requests
│   ├── reconciliation/
│   │   └── app.ts              # Checks cache and database
│   ├── services/
│   │   ├── supabaseClient.ts   # Connects to Supabase
│   │   ├── redisClient.ts      # Connects to Redis
│   │   └── contactService.ts   # Manages customer data
│   ├── types/
│   │   └── model.d.ts          # Defines data types for safety
│   └── utils/
│       ├── cache.ts            # Handles caching
│       ├── error.ts            # Defines error types
│       ├── logger.ts           # Logs messages for debugging
│       ├── validator.ts        # Checks API inputs
│       └── hash.ts             # Makes unique cache keys
├── scripts/
│   └── initdb.sql              # Sets up the Supabase database
├── .gitignore                  # Skips unwanted files
├── package.json                # Lists tools and scripts
├── tsconfig.json               # Configures TypeScript
├── template.yaml               # Defines AWS resources
├── README.md                   # This guide

Why This Structure?

Clear Roles: Each file has one job (e.g., app.ts for API, contactService.ts for database).
Easy to Maintain: Separating tasks makes it simple to fix or add features.
Team-Friendly: Developers can work on different parts without conflicts.

How It Works: Architecture

Click to expand: How the API processes a request

Here’s how a request to /identify works:

API Gateway: Grabs the request (e.g., https://hlidc410o7.../identify) and sends it to the Lambda function.
Lambda Function (src/identify/app.ts):
Checks if the request has an email or phone number.
Passes it to reconciliation/app.ts.


Reconciliation (src/reconciliation/app.ts):
Looks in Redis for a saved response (using a unique key).
If found, returns it fast (~3ms).
If not, asks Supabase for the data.


Supabase (src/services/contactService.ts):
Searches the contact table for matching email or phone number.
Creates a new record if none match, or links to an existing one.
Combines all emails and phone numbers into one response.


Redis Caching (src/utils/cache.ts):
Saves the response for 1 hour to speed up future requests.


Response: Sends back a JSON with all customer details.

Why This Flow?

Fast: Caching skips slow database calls.
Accurate: Supabase keeps data organized.
Scalable: AWS handles any number of requests.

Setup Instructions

Click to expand: How to set up the project

Prerequisites

Node.js 18+: Runs the code and installs tools. Download.
AWS CLI: Deploys to AWS. Install.
SAM CLI: Builds serverless apps. Install.
Supabase Account: Sign up at Supabase.
Upstash Account: Sign up at Upstash.
VS Code: For coding and testing with Thunder Client.

Step 1: Clone the Project
git clone <your-repository-url>
cd bitespeed-identity-reconciliation
npm install

Why? Gets the code and installs tools like TypeScript and Supabase libraries.
Step 2: Set Up Supabase

Log in to Supabase Dashboard.
Create a project (e.g., name: bitespeed-identity, region: us-east-1).
In SQL Editor, run scripts/initdb.sql:CREATE TABLE public.contact (
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


Get your Project URL and Anon Key from Settings > API (needed for deployment).

Why? Supabase stores customer data, and indexes make searches fast.
Step 3: Set Up Upstash Redis

Log in to Upstash Console.
Create a database (e.g., bitespeed-redis, region: us-east-1).
Get the REST API URL and Token from Details > REST API.
Test connectivity:redis-cli --tls -u redis://default:<your-token>@<your-database>.upstash.io:6379
ping


Should return PONG.



Why? Redis caches responses to make the API quick.
Step 4: Build the App

Check Code:npm run compile


Format Code:npm run lint


Bundle Code:npm run build


Prepare for Deployment:sam build



Why? Ensures the code is error-free and ready for AWS.
Step 5: Deploy to AWS

Run:sam deploy --guided


Answer prompts:
Stack Name: bitespeed-identity-reconciliation
Region: us-east-1
Parameters: Enter Supabase URL, Anon Key, Upstash REST URL, and Token when asked.
Confirm changes: Yes
Allow IAM role creation: Yes
Save arguments: Yes (optional)


Note the API URL: https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/

Why? Deploys the API securely, with credentials entered manually.


Testing the API: For Interviewers

Click to expand: How to test the API

The API is live at https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify. It accepts POST requests with an email and/or phone number to identify customers. Below are test cases to try with curl, Postman, or Thunder Client (a VS Code extension).
Test Case 1: Identify Existing Contact
curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
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
curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
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
curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
     -H "Content-Type: application/json" \
     -d '{}'


What It Does: Tests error handling for missing inputs.
Expected Response (Status: 400 Bad Request):{
  "error": "Either email or phoneNumber is required"
}



Test Case 4: Email Only
curl -X POST https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify \
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

Install Thunder Client in VS Code (Extension).
Create a collection: Bitespeed Identity Reconciliation.
Add each test case:
Method: POST
URL: https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify
Header: Content-Type: application/json
Body: Copy the JSON from above.


Click Send and check responses.

Why These Tests?

They cover all cases: existing customers, new customers, errors, and partial inputs.
Interviewers can test the live API without any setup.

Monitoring and Debugging

Click to expand: How to check if it’s working


AWS CloudWatch:

Go to AWS Console > CloudWatch > Log Groups > /aws/lambda/id-reconci-IdentifyFunction-AIzvGDvCQDle.
Look for INFO logs like Created new primary contact or Cache hit.
Check ERROR logs if issues occur.


Supabase Dashboard:

Check Table Editor > public > contact for customer data.
Use Reports > API to monitor query speed.


Upstash Console:

Check Data Browser for cached keys (e.g., identify:<hash>).
Monitor Metrics for cache hits and response times.



Why Monitor?

Ensures the API runs smoothly and performs well.
Helps find and fix issues quickly.

Performance Optimizations

Click to expand: How we made it fast


Redis Caching: Saves responses for 1 hour, making repeated requests quick (~3ms).
Supabase Indexes: Fast searches for emails and phone numbers.
Lambda Settings: 256MB memory and optimized code for low latency.
API Gateway Caching: Can be enabled for 60-second caching.

Why Optimize?

Fast responses improve customer experience.
Saves money by reducing server and database usage.

Troubleshooting

Click to expand: Common issues and fixes


500 Internal Server Error:
Check CloudWatch logs for details.
Verify Supabase table (public.contact) and permissions.
Ensure deployment credentials are correct.


400 Bad Request:
Include email or phoneNumber in the request.


Slow Responses:
Enable API Gateway caching or Lambda warm-ups (every 5 minutes).


Deprecation Warning:
A punycode warning in logs is harmless but can be fixed by updating dependencies.



Why Troubleshoot?

Keeps the API reliable for real-world use.
Shows interviewers the project handles errors well.

Submission

GitHub:git add .
git commit -m "Complete Bitespeed Identity Reconciliation project"
git push origin main


API URL: https://hlidc410o7.execute-api.us-east-1.amazonaws.com/Prod/identify
Submit: Share the repository URL and API URL via Bitespeed Google Form.

Why Submit This Way?

Public repo for code review.
Live API URL for easy testing.

Future Improvements

Add Jest tests to check code automatically.
Use Supabase Realtime to update cache on data changes.
Add a queue (SQS) for high traffic.
Integrate Sentry for better error tracking.

Why Improve?

Makes the app more robust for real-world use.
