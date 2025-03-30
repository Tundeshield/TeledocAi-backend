# TeleDoc AI Backend

Backend API for TeleDoc AI - an AI-powered telemedicine platform enabling patients to upload skin images and vital signs for preliminary diagnostic analysis, connect with doctors for virtual consultations, and track health progress over time.

## Features

- Image & vitals upload with AI analysis
- Consultation booking
- Doctor follow-up notes
- Patient health tracking
- Mock AI integration for prototype

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **AI Scripts**: Python with mock analysis
- **Deployment**: Docker

## Setup Instructions

### Docker Setup (Recommended)

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Set up Supabase:
   - Create a new project
   - Set up the tables (submissions, consults, tracking)
   - Create a storage bucket named 'uploads'
   - Add your Supabase URL and key to .env
4. Build and run with Docker Compose:
   ```
   docker-compose up -d
   ```

### Manual Setup

1. Clone the repository
2. Install Node.js dependencies:
   ```
   npm install
   ```
3. Install Python dependencies:
   ```
   pip install -r python-requirements.txt
   ```
4. Create a `.env` file based on `.env.example`
5. Set up Supabase as described above
6. Start the server:
   ```
   npm start
   ```

## API Endpoints

- `POST /api/upload` - Upload image + vitals, run AI analysis
- `GET /api/results/:id` - Retrieve analysis result and consult link
- `POST /api/consult` - Request a consult for a submission
- `POST /api/followup` - Doctor adds diagnosis, prescription, next step
- `POST /api/track` - Patient submits update, returns trend

## Development

Start the development server with hot reload:

```
npm run dev
```

## Production Deployment

For production deployment, use Docker:

```
# Build the image
docker build -t teledoc-ai-backend .

# Run the container
docker run -p 3000:3000 --env-file .env -d teledoc-ai-backend
```

## Testing the API

Use curl or Postman to test the API endpoints. Example:

```bash
# Upload an image
curl -X POST http://localhost:3000/api/upload \
  -F "image=@/path/to/image.jpg" \
  -F "vitals=HR 120, Temp 38.5"

# Get results
curl http://localhost:3000/api/results/your-submission-id
``` 