# News API Service

A NestJS-based API service that interacts with the GNews API for fetching news articles. This service provides caching functionality to improve performance and reduce redundant API calls.

## Features

- Fetch N news articles with optional filtering
- Find news articles by title
- ~~Find news articles by author~~
- Search articles by keywords
- Built-in caching mechanism
- Swagger API documentation

## Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- Docker and Docker Compose (optional, for containerized deployment)
- GNews API key (sign up at [https://gnews.io/](https://gnews.io/))

## Installation

1. Clone the repository:

```bash
git clone git@github.com:devshark/news-api-service.git
cd news-api-service
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the example:

```bash
cp .env.example .env
```

4. Add your GNews API key to the `.env` file:

```
GNEWS_API_KEY=your_gnews_api_key_here
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Using Docker

```bash
# Build the Docker image
npm run docker:build

# Start the container
npm run docker:up

# Stop the container
npm run docker:down
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## API Endpoints

### Get News Articles

```
GET /news
```

Query parameters:
- `q` (required): Search query
- `country` (optional): This parameter allows you to specify the country where the news articles were published
- `lang` (optional): This parameter allows you to specify the language of the news articles
- `max` (optional, default: 10): Maximum number of articles to return

### Find Articles by Title

```
GET /news/title/:title
```

Query parameters:
- `max` (optional, default: 10): Maximum number of articles to return

### Find Articles by Author

Unfortunately, GNews doesn't support author filters, not does the payload contain author information. This is a limitation from GNews. In this case, we could potentially fetch from other sources, but we'll leave it here as a limitation.

### Search Articles by Keywords

```
GET /news/search/:keywords
```

Query parameters:
- `max` (optional, default: 10): Maximum number of articles to return

## Caching

The service implements a caching mechanism to improve performance and reduce the number of API calls to GNews. By default, cache entries expire after 5 minutes.

Under the hood, it's using [@nestjs/cache-manager](https://docs.nestjs.com/techniques/caching) in-memory cache. For distributed caching, you can configure a different store like Redis.

## License

This project is licensed under the [MIT License](LICENSE)

## Author

&copy; Anthony Lim


