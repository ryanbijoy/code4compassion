# EcoScore - Local Development Setup

## Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Git**

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ecoscore-app
```

## 2. Install Dependencies

```bash
npm install
```

## 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://awvnaklolkreqdqpjjzs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3dm5ha2xvbGtyZXFkcXBqanpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NjQxODUsImV4cCI6MjA2NzQ0MDE4NX0.msj6IiQZqQjZ01D3rRrVYNcC6dtpfZu8teXEk7pa2yg
```

## 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 7. Verify Setup

1. **Check the Dashboard**: Navigate to `/dashboard` to see if institutions load
2. **Test Form Submission**: Try submitting an institution on the home page
3. **Check Database**: Verify data appears in your Supabase dashboard

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── pages/              # Page components
│   ├── Home.tsx        # Landing page with submission form
│   ├── Dashboard.tsx   # Institution listing and search
│   └── Methodology.tsx # Scoring methodology explanation
├── lib/                # Utilities and services
│   └── supabase.ts     # Database client and functions
└── main.tsx           # App entry point
```

## Key Features

- **Institution Submission**: Users can submit institutions for scoring
- **Real-time Dashboard**: View and filter scored institutions
- **Database Integration**: All data stored in Supabase
- **Webhook Integration**: Submissions sent to n8n workflow
- **Responsive Design**: Works on desktop and mobile

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Make sure `.env` file is in the root directory
   - Restart the dev server after adding environment variables

2. **Database Connection Errors**
   - Verify your Supabase URL and key are correct
   - Check if your Supabase project is active

3. **Migration Errors**
   - Ensure you have the correct permissions in Supabase
   - Try running the SQL manually in the Supabase SQL Editor

4. **Form Submission Fails**
   - Check browser console for errors
   - Verify the n8n webhook URL is accessible

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Database Schema

The application uses two main tables:

### `institutions`
- Stores scored institutions with their ratings
- Includes animal welfare and environmental scores
- Public read access enabled

### `institution_submissions`
- Tracks user submissions for new institutions
- Includes processing status and email notifications
- Public insert access for submissions

## API Integration

The app integrates with your n8n workflow at:
`https://code4compassionmumbai.app.n8n.cloud/webhook-test/form-data`

Submissions are sent to both the database and the webhook for processing.
