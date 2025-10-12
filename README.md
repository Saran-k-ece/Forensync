# Digital Forensics Evidence Management System

A modern MERN stack application for managing digital forensics evidence with real-time tracking capabilities. Designed for law enforcement use with hardware integration support.

## Features

- **Hardware Integration**: Accepts POST requests from ESP8266 Wi-Fi modules with RFID scan data
- **Real-time Dashboard**: Live evidence tracking with automatic updates
- **MongoDB Database**: Secure storage of all evidence records
- **Authentication**: Admin access with predefined credentials
- **CRUD Operations**: Full management of evidence records
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Status Tracking**: Monitor evidence through collection, transit, storage, analysis, and release
- **Visual Indicators**: Highlight new entries and status changes

## Project Structure

```
project/
├── backend/                 # Node.js + Express backend
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── .env               # Environment variables
│   ├── .env.example       # Environment template
│   ├── server.js          # Server entry point
│   └── package.json       # Backend dependencies
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── context/       # React context (Auth)
    │   ├── pages/         # Page components
    │   ├── services/      # API service layer
    │   ├── App.jsx        # Main app component
    │   ├── main.jsx       # React entry point
    │   └── index.css      # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json       # Frontend dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB cluster (MongoDB Atlas or local installation)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB connection:
   - Open `backend/.env`
   - Replace `MONGO_URL` with your MongoDB cluster connection string:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/forensics?retryWrites=true&w=majority
   ```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Credentials

- **Username**: admin
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Evidence Management
- `POST /api/evidence/hardware` - Receive data from ESP8266 (no auth required)
- `GET /api/evidence` - Get all evidence records (auth required)
- `GET /api/evidence/:id` - Get single evidence record (auth required)
- `PUT /api/evidence/:id` - Update evidence record (auth required)
- `DELETE /api/evidence/:id` - Delete evidence record (auth required)
- `PATCH /api/evidence/:id/mark-viewed` - Mark evidence as viewed (auth required)

## Hardware Integration

Send POST requests to `/api/evidence/hardware` with the following JSON structure:

```json
{
  "tagId": "RFID_TAG_12345",
  "location": "Evidence Room A",
  "status": "Collected",
  "description": "Optional description"
}
```

Example ESP8266 Arduino code snippet:

```cpp
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* serverUrl = "http://your-server-ip:5000/api/evidence/hardware";

void sendEvidence(String tagId, String location) {
  HTTPClient http;
  WiFiClient client;

  http.begin(client, serverUrl);
  http.addHeader("Content-Type", "application/json");

  String jsonData = "{\"tagId\":\"" + tagId + "\",\"location\":\"" + location + "\",\"status\":\"Collected\"}";

  int httpCode = http.POST(jsonData);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.println(response);
  }

  http.end();
}
```

## Evidence Status Options

- **Collected**: Initially collected evidence
- **In Transit**: Evidence being moved between locations
- **Stored**: Evidence in secure storage
- **Under Analysis**: Evidence being analyzed
- **Released**: Evidence released from custody

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS
- dotenv

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

## Production Deployment

### Backend
1. Set environment variables on your hosting platform
2. Build and deploy the Node.js application
3. Ensure MongoDB connection string is properly configured

### Frontend
1. Build the production bundle:
```bash
npm run build
```
2. Deploy the `dist` folder to your hosting platform
3. Update API base URL if needed (in `src/services/api.js`)

## Security Notes

- Change default admin credentials in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Regularly backup MongoDB database
- Use MongoDB Atlas IP whitelist for additional security

## License

ISC
