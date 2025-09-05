# Kabwe Central SDA Church Choir Management System

A comprehensive choir management system built with Google Apps Script backend and vanilla JavaScript frontend, deployed on Netlify.

## 🎵 Features

- **Member Management**: Registration, profiles, and status tracking
- **Attendance Tracking**: Real-time attendance marking for various service types
- **Admin Dashboard**: Complete oversight with analytics and reporting
- **Google Sheets Integration**: Automatic data synchronization via Google Apps Script
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Export Functionality**: CSV exports for data analysis
- **Real-time Updates**: Live data synchronization across all devices

## 🚀 Live Demo

[View Live Demo](https://your-netlify-app.netlify.app)

## 📁 Repository Structure

```
kabwe-choir-management/
├── index.html                 # Main application file
├── README.md                  # This file
├── netlify.toml              # Netlify configuration
├── _redirects               # Netlify redirects
├── gas/
│   └── Code.gs              # Google Apps Script backend
└── assets/
    └── screenshots/         # Application screenshots
```

## ⚡ Quick Setup

### 1. Google Sheets Setup

1. Create a new Google Sheet called "Kabwe Choir Database"
2. Note the Spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### 2. Google Apps Script Setup

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project called "Kabwe Choir API"
3. Replace the default code with the content from `gas/Code.gs`
4. Update the `SPREADSHEET_ID` variable with your sheet ID:
   ```javascript
   const SPREADSHEET_ID = 'your-actual-spreadsheet-id-here';
   ```
5. Deploy as web app:
   - Click "Deploy" → "New deployment"
   - Type: Web app
   - Execute as: Me
   - Access: Anyone
   - Copy the web app URL

### 3. Frontend Configuration

1. Open the deployed Netlify site
2. In the setup section, paste your Google Apps Script URL
3. Click "Test Connection" and then "Initialize Database"
4. Your system is ready to use!

### 4. Default Admin Access

- **Username**: Any name
- **Phone**: Any phone number  
- **Password**: `admin123`

## 🔧 Development Setup

### Prerequisites

- Google account
- Basic understanding of Google Sheets and Apps Script
- Git installed on your machine

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kabwe-choir-management.git
   cd kabwe-choir-management
   ```

2. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Or open index.html directly in browser
   ```

3. **Configure Google Apps Script**
   - Follow the Google Apps Script setup steps above
   - Update the GAS URL in your local environment

## 🌐 Netlify Deployment

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Deploy settings:
     - Build command: (leave empty)
     - Publish directory: (leave empty or set to `/`)
   - Click "Deploy site"

3. **Custom Domain** (Optional)
   - In Netlify dashboard, go to Domain management
   - Add your custom domain
   - Configure DNS settings as instructed

### Method 2: Manual Deployment

1. **Build the site** (if needed)
   ```bash
   # No build process required for this project
   zip -r site.zip . -x "*.git*" "*.md" "gas/*"
   ```

2. **Upload to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop your project folder or zip file
   - Your site will be deployed instantly

## 📖 Usage Guide

### For Members

1. **Registration**
   - Click "New Member? Register"
   - Fill in your details (name, phone, voice part, email)
   - Submit registration

2. **Login**
   - Enter your registered name and phone number
   - Leave password field blank
   - Click "Login"

3. **Mark Attendance**
   - Select the date and service type
   - Click "Mark My Attendance"
   - View your attendance history

### For Administrators

1. **Login**
   - Enter any name and phone number
   - Enter admin password: `admin123`
   - Click "Login"

2. **Member Management**
   - Add new members
   - Edit member details
   - Activate/deactivate members
   - Export member lists

3. **Attendance Management**
   - View all attendance records
   - Mark bulk attendance
   - Delete attendance records
   - Export attendance data

4. **Reports & Analytics**
   - Generate attendance reports
   - View statistics and trends
   - Filter by date ranges and service types

## 🔒 Security Features

- **Role-based access control**: Admin vs member permissions
- **Data validation**: Input sanitization and validation
- **HTTPS only**: Secure data transmission
- **CORS protection**: Configured for Google Apps Script
- **No sensitive data exposure**: Admin passwords stored securely

## 🛠️ Customization

### Adding New Service Types

1. **Frontend**: Update the select options in both member and admin sections
2. **No backend changes needed**: Google Apps Script handles any service type dynamically

### Changing Admin Password

1. **Google Sheets**: Go to the Settings sheet
2. **Update**: Change the value for `adminPassword`
3. **Immediate effect**: Changes apply instantly

### Styling Changes

- **CSS**: All styles are in the `<style>` section of `index.html`
- **Colors**: Update the CSS variables for consistent theming
- **Responsive**: Mobile-first design with CSS Grid and Flexbox

## 📊 Data Structure

### Members Sheet
| ID | Name | Phone | Voice Part | Email | Registered Date | Status |
|----|------|-------|------------|-------|-----------------|--------|

### Attendance Sheet
| ID | Member ID | Member Name | Date | Service Type | Status | Timestamp |
|----|-----------|-------------|------|--------------|--------|-----------|

### Settings Sheet
| Key | Value |
|-----|-------|
| adminPassword | admin123 |
| nextMemberId | 1 |
| nextAttendanceId | 1 |

## 🔧 Troubleshooting

### Common Issues

1. **"API URL not configured"**
   - Solution: Set up Google Apps Script and paste the web app URL

2. **"Connection failed"**
   - Check: Google Apps Script deployment permissions
   - Ensure: Web app is accessible to "Anyone"

3. **"Data not saving"**
   - Verify: Spreadsheet ID in Google Apps Script
   - Check: Sheet permissions and sharing settings

4. **"Attendance already marked"**
   - Expected behavior: Prevents duplicate entries
   - Solution: Delete existing record if needed

### Performance Optimization

- **Large datasets**: Google Apps Script handles up to 1000+ records efficiently
- **Concurrent users**: System supports multiple simultaneous users
- **Data caching**: Frontend caches data locally for faster performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

- **Documentation**: Check the repository for detailed guides
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Contact**: [Your contact information]

## 🎯 Roadmap

- [ ] Email notifications for attendance reminders
- [ ] Mobile app with offline capability
- [ ] Advanced reporting with charts
- [ ] Integration with church management systems
- [ ] Automated backup system
- [ ] Multi-language support

---

**Made with ❤️ for Kabwe Central SDA Church Choir**
