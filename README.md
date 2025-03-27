# Indian Product Price Calculator

A web application that calculates the final cost of Indian e-commerce products in NPR (Nepalese Rupee) for Nepali users. This tool helps Nepali shoppers understand the true cost of importing products from Indian e-commerce websites.

## Features

- Scrapes product information from Amazon India, Flipkart, and Myntra
- Converts prices from INR to NPR using current exchange rates
- Calculates shipping costs based on product weight
- Adds 30% excise duty on top of the product price
- Provides a detailed cost breakdown
- Caches results to improve performance

## Tech Stack

- **Frontend**: React, TailwindCSS, Shadcn UI components
- **Backend**: Node.js, Express
- **Web Scraping**: cheerio, node-fetch
- **Caching**: In-memory storage

## Deployment to Render

This application is ready to deploy on [Render](https://render.com/). Follow these steps to deploy:

1. Create a new Render account if you don't have one
2. Fork or clone this repository to your GitHub account
3. In the Render dashboard, click "New" and select "Web Service"
4. Connect your GitHub account and select this repository
5. Configure the deployment with these settings:
   - **Name**: indian-product-price-calculator (or any name you prefer)
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `node --experimental-modules start-production.js`
   - **Plan**: Free

6. Add the following environment variables under the "Environment" tab:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render will override this with its own port)

7. Click "Create Web Service"

The application will automatically build and deploy. Once deployed, your app will be available at the URL provided by Render.

## Local Development

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open http://localhost:5000 in your browser

## License

MIT