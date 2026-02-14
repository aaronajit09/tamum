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

## Setup

1. **Supabase Setup:**
   - Follow `SUPABASE_SETUP.md` to create your database and storage buckets
   - The website is already configured with your Supabase credentials

2. **Local Development:**
   - Open `index.html` in your browser
   - Everything should work locally

3. **GitHub Pages Deployment:**
   - Push this code to GitHub
   - Go to **Settings** → **Pages**
   - Set **Source** to **"Deploy from a branch"**
   - Select **"main"** branch and **"/ (root)"** folder
   - Click **Save**
   - Your site will be live at: `https://your-username.github.io/repository-name`


## Security Note

The Supabase anon key is public (as intended) and the admin password is client-side only. For production use, consider implementing proper authentication if needed.

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
