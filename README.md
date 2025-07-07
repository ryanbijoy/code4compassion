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

## 3. Set Up Supabase Database

### Option A: Use Existing Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or use an existing one
3. Go to Settings → API to get your credentials

### Option B: Run Supabase Locally (Advanced)
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Start local Supabase
supabase start
```

## 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get these values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "Project URL" and "anon public" key

## 5. Set Up Database Schema

Run the migration to create the required tables:

```bash
# If using Supabase CLI locally
supabase db reset

# If using hosted Supabase, run the SQL manually:
# Go to your Supabase dashboard → SQL Editor
# Copy and paste the contents of supabase/migrations/20250707035621_shy_bread.sql
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

## Next Steps

1. **Customize Styling**: Modify Tailwind classes to match your brand
2. **Add Authentication**: Implement user accounts if needed
3. **Enhance Scoring**: Connect with your AI scoring pipeline
4. **Add Analytics**: Track user engagement and submissions
5. **Deploy**: Use Vercel, Netlify, or similar for hosting

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your environment variables
3. Ensure your Supabase project is properly configured
4. Test the database connection in the Supabase dashboard