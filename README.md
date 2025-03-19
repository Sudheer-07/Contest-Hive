# Contest Tracker

A comprehensive web application that tracks competitive programming contests from popular platforms like Codeforces, CodeChef, and LeetCode. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 📋 Features

- **Contest Aggregation**: Fetches and displays upcoming contests from Codeforces, CodeChef, and LeetCode
- **Time Tracking**: Shows the date of each contest and the time remaining before it starts
- **Past Contest Archive**: Access historical contest information
- **Platform Filtering**: Filter contests by your preferred platforms (e.g., only Codeforces, or Codeforces + LeetCode)
- **Bookmarking System**: Save contests you're interested in for quick access
- **Solution Links**: Access solution videos from our YouTube channel for past contests
- **Responsive Design**: Fully functional on mobile, tablet, and desktop devices
- **Theme Toggle**: Switch between light and dark mode based on your preference

## 📱 Screenshots

*[Insert screenshots of your application here]*

## 🛠️ Tech Stack

- **Frontend**: React.js, Redux for state management, Styled Components/Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API Integration**: Axios for API calls
- **Deployment**: Docker, AWS/Heroku

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB (local or Atlas URI)
- npm or yarn

### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/contest-tracker.git
   cd contest-tracker/server
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

4. Start the server
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory
   ```bash
   cd ../client
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the React application
   ```bash
   npm start
   ```

## 🚀 Usage

1. Visit `http://localhost:3000` in your browser
2. Browse upcoming contests from all platforms
3. Use the filter to narrow down contests by platform
4. Bookmark contests you're interested in
5. Check past contests and access solution videos when available

## 🔄 Data Flow

1. Contest data is fetched from platform APIs (Codeforces, CodeChef, LeetCode)
2. Data is processed and stored in MongoDB
3. Frontend requests data through Express API endpoints
4. User interactions (bookmarks, filters) are managed with Redux
5. Solution links are either manually added or automatically fetched from YouTube API

## 🔐 Admin Panel

A separate admin panel is available for team members to:
- Add solution links manually
- Manage contests
- View user analytics

Access the admin panel at `/admin` with appropriate credentials.

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Adaptive layouts for various screen sizes
- Touch-friendly UI elements

## 🎨 Theme Toggle

Users can switch between:
- Light mode: Clean, bright interface
- Dark mode: Eye-friendly dark interface

## 🔄 Future Improvements

- Add user accounts and personalized recommendations
- Implement email/browser notifications for contest reminders
- Expand to include more competitive programming platforms
- Add contest difficulty ratings and categories

## 👥 Contributors

- Sudheer Battula 

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
