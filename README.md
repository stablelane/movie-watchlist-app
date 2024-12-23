# Movie Watchlist App

A web application for users to manage their personal movie watchlist. The app supports user authentication, Google OAuth integration, and interaction with the OMDB API. This project was implemented as a learning exercise to understand OAuth and user authentication, avoiding the use of external libraries like `googleapis` to implement Google OAuth.

## Features

- User authentication with secure password hashing using bcrypt
- Google OAuth for easy user sign-in
- Add movies to a personalized watchlist using the IMDb ID
- Fetch movie details from the OMDB API
- Remove movies from the watchlist

## Requirements

- Node.js
- MongoDB

## Installation

Follow these steps to set up and run the application:

1. Clone the repository:
   ```bash
   git clone https://github.com/stablelane/movie-watchlist.git
   cd movie-watchlist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Ensure MongoDB is installed and running on your local machine.
   - Use the default `mongodb://localhost/moviewatchlist` URL for the database.

4. Configure environment variables:
   - Create a `.env` file in the root of the project.
   - Add the following variables:
     ```env
     ACCESS_TOKEN_SECRET=<your-64-bit-secret-key>
     GOOGLE_CLIENT_ID=<your-google-client-id>
     GOOGLE_CLIENT_SECRET=<your-google-client-secret>
     GOOGLE_OAUTH_REDIRECT_URL=<your-google-oauth-redirect-url>
     ```
   - To generate a 64-bit secret key, use the following command:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```

5. Start the application:
   ```bash
   npm run devStart
   ```

6. Access the app:
   - Open your browser and navigate to `http://localhost:3000`.

## API Endpoints

### Authentication Routes

1. **Login**
   - `GET /auth/login` - Render the login page.
   - `POST /auth/login` - Authenticate the user and issue a JWT.

2. **Signup**
   - `GET /auth/signup` - Render the signup page.
   - `POST /auth/signup` - Create a new user account.

3. **Google OAuth**
   - `GET /auth/google` - Redirect to Google OAuth consent screen.
   - `GET /auth/google/callback` - Handle Google OAuth callback and create a session.

4. **Logout**
   - `GET /auth/logout` - Clear the JWT cookie and redirect to the login page.

### Watchlist Routes

1. **Get Watchlist**
   - `GET /api/watchlist` - Fetch the user's watchlist.

2. **Add to Watchlist**
   - `POST /api/watchlist` - Add a movie to the watchlist using the IMDb ID.

3. **Remove from Watchlist**
   - `DELETE /api/watchlist` - Remove a movie from the watchlist by IMDb ID.


## Notes

- Make sure MongoDB is running locally or update the connection string in the application.
- For Google OAuth, configure the credentials on Google Cloud Console and replace the placeholders in `.env` with your values.



