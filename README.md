# NepalShippr

A web application that calculates the final cost of Indian e-commerce products in NPR for Nepali users.

## Features

- Scrape product details from Amazon India, Flipkart, and Myntra
- Convert prices from INR to NPR using real-time exchange rates
- Calculate shipping costs based on product weight
- Add 30% excise duty as per Nepali customs regulations
- Export results as PDF for easy sharing and reference

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js, Express.js
- **Web Scraping**: Cheerio, node-fetch
- **PDF Generation**: jsPDF
- **Form Handling**: React Hook Form, Zod validation

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment on Render

This application is ready to be deployed on [Render](https://render.com/).

### Prerequisites

1. Create a Render account if you don't have one already
2. Fork or clone this repository to your GitHub account

### Deployment Steps

1. In your Render dashboard, go to "New +" and select "Web Service"
2. Connect your GitHub repository
3. Fill in the following details:
   - **Name**: nepalshippr (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Click "Create Web Service"

### Environment Variables

Add the following environment variables in the Render dashboard:

- `NODE_ENV`: `production`
- `PORT`: `10000` (or your preferred port)

## License

MIT