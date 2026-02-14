# MSFC Website

A static website for Medical Students for Choice, featuring board member information, medical resources, newsletter management, and event listings.

## Features

- Responsive design
- Board member profiles
- Medical resources section
- Newsletter management system with Supabase
- Event management
- Email subscription system
- Admin authentication
- GitHub Pages deployment with secrets

## Local Development Setup

1. **Install Node.js** (if not already installed)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build for local development:**
   ```bash
   npm run dev
   ```
   This injects your `.env` values into `script.js` for local testing.

4. **Open the site:**
   - Open `index.html` in your browser
   - The site will work with your local Supabase data

## Supabase Setup

Follow the instructions in `SUPABASE_SETUP.md` to:
- Create a Supabase project
- Set up database tables (subscribers, newsletters, events)
- Create storage buckets
- Configure policies

## GitHub Pages Deployment

1. **Set up GitHub Secrets:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_ANON_KEY`: Your Supabase anon key
     - `ADMIN_PASSWORD`: Your admin password

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Set source to "GitHub Actions"
   - The workflow will automatically deploy on pushes to `main`

3. **Your site will be live** at: `https://your-username.github.io/repo-name`

## Admin Access

- Admin password is stored in GitHub secrets (not visible in code)
- Log in from any page to access admin features

## Security

- Supabase keys are hidden in GitHub secrets for production
- Local development uses `.env` file (not committed to git)
- Admin password is client-side only (not truly secret, but hidden from casual inspection)

## File Structure

```
├── index.html          # Home page
├── board.html          # Board members page
├── medical-info.html   # Medical resources page
├── newsletters.html    # Newsletters page
├── admin.html          # Admin upload page
├── style.css           # Styles
└── script.js           # JavaScript functionality
```

## Security Notes

- The admin password is stored in the frontend code. In a production environment, you should implement proper backend authentication.
- GitHub tokens should be kept secure and not committed to the repository.
- Consider implementing rate limiting and additional security measures for the admin interface.

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 