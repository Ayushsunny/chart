# Live Updating Price Charting Interface

This project is a secure charting interface that displays live updating prices of various assets using the Binance API. It includes Google authentication for logging in and features a responsive, interactive chart built with Highcharts, smooth price updates, and additional functionalities such as a watchlist and a paper trading interface.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Features

- Secure authentication with Google.
- Real-time updating prices using Binance WebSocket API.
- Historical data fetched from Binance Historical API.
- Interactive line chart with smooth transitions.
- Customizable chart options (symbols, intervals).
- Watchlist management.
- Paper trading interface with buy/sell functionality.
- Responsive and visually appealing UI.

## Demo

You can view a live demo of the application [here](https://optionlogychart.vercel.app/).

## Technologies Used

- **Frontend:**
  - Next.js
  - TypeScript
  - Highcharts
  - TailwindCSS
- **Backend:**
  - Next.js API Routes (preferred)
  - Node.js in TypeScript 
- **Authentication:**
  - NextAuth.js with Google OAuth
- **Deployment:**
  - Vercel

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ayushsunny/chart.git
   cd your-repo-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following environment variables:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

## Configuration

Make sure to set up your Google OAuth credentials by creating a project on the Google Developer Console and obtaining the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Add these to your `.env.local` file.

## Usage

1. **Login:**
   Open the application in your browser and log in using your Google account.

2. **View Charts:**
   Once logged in, you can view live updating price charts for different assets. Use the dropdown menus to change the asset symbol and time interval.

3. **Manage Watchlist:**
   Add or remove assets from your watchlist using the provided buttons.

4. **Paper Trading:**
   Use the paper trading interface to simulate buying and selling assets. Check your balance and holdings in the trading card.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── page.tsx
├── components/
│   ├── Chart/
│   │   └── chart.tsx
│   ├── Login/
│   │   └── login.tsx
│   ├── Logout/
│   │   └── logout.tsx
├── lib/
│   └── auth.ts
```

- **`src/app/api/auth/[...nextauth]/route.ts`**: Configures NextAuth for authentication.
- **`src/app/page.tsx`**: The main page component handling login and chart display.
- **`src/components/Chart/chart.tsx`**: The chart component with Highcharts and WebSocket integration.
- **`src/components/Login/login.tsx`**: The login button component.
- **`src/components/Logout/logout.tsx`**: The logout button component.
- **`src/lib/auth.ts`**: Contains authentication options and configurations for NextAuth.
