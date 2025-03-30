# Mediflow-360
NARRA DIGVIJAY(TEAM LEAD),
M.V.S HARSHITH 

## Project Submission

*GitHub Repository*: [Mediflow-360](https://github.com/narradigvijay/mediflow-360)  
*Demo Video*: https://drive.google.com/file/d/1x3GwoO94RZBcRC8onishxRw85J27cyxC/view?usp=sharing

## Problem Statement

In the current healthcare landscape, managing medical records efficiently remains a challenge. Patients often struggle to maintain their medical history, and healthcare providers face difficulties in accessing patient data promptly. There is a need for a centralized, secure, and efficient health record management system that provides seamless access to medical history, lab reports, and emergency information.

## Team Members

- Digvijay Narra (GitHub: @narradigvijay)


## Solution Overview

Mediflow-360 is a *health record management system* that enables patients, doctors, and hospitals to securely manage medical records, track lab/test results, and provide AI-powered health insights. It offers features such as:
- *Patient and Doctor Access to Records*
- *Lab/Test Result Tracking with Automated Precautions & Referrals*
- *Symptom Tracking for Recurring Issues*
- *Emergency Access to Patient Details*
- *AI-Based Health Risk Prediction*
- *Emergency Hospital Locator for Treatments*
- *Doctor Appointment Scheduling*
- *Emergency First-Aid Tutorials*

## Tech Stack

Mediflow-360 is built using:
- *Frontend*: React.js, Vite, TypeScript, ShadCN
- *Backend*: Node.js, Express.js
- *Database*: MongoDB (Cloud-based via MongoDB Atlas)
- *Authentication*: JWT (JSON Web Token)
- *AI Model*: Integrated for health risk prediction
- *APIs Used*: Google Maps API (for hospital locator), OpenAI API (for AI-based predictions)

## Installation & Setup

Follow these steps to run the project locally:

### *1. Clone the Repository*
sh
git clone https://github.com/narradigvijay/mediflow-360.git
cd mediflow-360


### *2. Setup Backend*
sh
cd backend
npm install


#### *Configure Environment Variables*
Create a .env file in the backend directory and add:
env
MONGO_URI=<Your MongoDB Atlas Connection String>
JWT_SECRET=<Your Secret Key>
PORT=5000


Run the backend server:
sh
npm start


### *3. Setup Frontend*
sh
cd ../frontend
npm install
npm run dev


The application will be available at http://localhost:5173.



## Open-Source Libraries & APIs Used

- Express.js
- Mongoose (MongoDB ODM)
- React.js
- Vite
- JWT Authentication
- Google Maps API
- OpenAI API

## Future Improvements

- Implement blockchain for secure medical record storage.
- AI-powered chatbot for instant medical guidance.
- IoT integration for real-time health monitoring.






