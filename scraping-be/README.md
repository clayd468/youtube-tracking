# Scraping

## Description

This is a scraping server that allows you to scrape data from provided URLs. It provides various endpoints for searching media, retrieving media details, retrieving user information, and performing authentication and registration.

## Prerequisites

- Node.js 16+
- Yarn or NPM

## Start a Docker container for Postgresql and Redis

```shell
docker compose up -d
```

## Installation

- Install dependencies

```bash
yarn install
```

Create configuration file from the template

```shell
cp .env.template .env

# Edit configuration to match your local environment and save
nano .env
```

Running migrate to create postgresql tables

```shell
yarn prisma:migrate

```

- Start Application

```bash
yarn start
```

The application will start on port **8080**

## Endpoints

| Endpoint       | Method | Parameters/Payload                           | Description                             |
| -------------- | ------ | -------------------------------------------- | --------------------------------------- |
| /media         | GET    | type=url,images,videos,searchText,page,limit | Search medias with specified parameters |
| /media/:id     | GET    | id                                           | Retrieve media by ID                    |
| /scraping      | POST   | urls: [http://example.com]                   | Scrape data from provided URLs          |
| /user/:userId  | GET    | userId                                       | Retrieve user information by user ID    |
| /auth/login    | POST   | username, password                           | Login with username and password        |
| /auth/register | POST   | username, password                           | Register with username and password     |

## Note

## System Architecture

### Redis

- **Purpose:** Used for caching and storing temporary data to reduce the load on the database and improve response times.
- **Usage:**
  - Caching media search results.
  - Caching media details by ID.
  - Storing intermediate scraping results.

### Bull Queue

- **Purpose:** Used for managing background jobs and scheduling tasks.
- **Usage:**
  - Adding media scraping tasks to the queue.
  - Processing media scraping tasks asynchronously.

### Rate Limiter

- **Purpose:** Protects the application from being overwhelmed by too many requests in a short period (DDoS attacks) and prevents abuse.
- **Usage:**
  - Limits the number of requests a user can make to the API within a specific time frame.

### Proxy

- **Purpose:** Acts as an intermediary for requests from clients seeking resources from other servers.
- **Usage:**
  - Forwarding requests to the API server running on the app port.
  - Can be replaced with NGINX for more advanced use cases in production.

### Connection Pooling

- **Purpose:** Reuses database connections instead of creating a new one for each request, reducing overhead.
- **Usage:**
  - Prisma ORM is used for managing connections to the Posgresql database with a connection limit set to improve performance.

### Additional Techniques:

- **Cluster:** Using Node.js native cluster module for multi-threading. In production, PM2 can be used for monitoring and auto-scaling clusters.
- **Middleware Authentication:** Validates requests with JWT token to verify user authentication and authorization. This middleware ensures that only authenticated users can access protected routes and perform authorized actions within the application.
- **Middleware Validation:** Validates requests before they reach the core application logic to ensure they meet expected formats and constraints.
- **Middleware Error Handling:** Validates error/success requests and directs the route accordingly.
- **Custom Logger:** Adding a custom logger to provide detailed logs and improve debugging capabilities.
- **Testing:** Adding unit tests and integration tests for services and controllers using Jest and Supertest to ensure the functionality and reliability of the application.

## Note

This scraping server is not perfect yet. While I have made efforts to cover various cases when scraping images and videos, there are some technical challenges that prevent crawling the root sources. To achieve comprehensive coverage, further investigation is required for scenarios such as viewing blob URLs for images/videos, scraping within iframes, and embedding videos.

Thank you for taking the time to read and review my work. If you have any suggestions or feedback, please feel free to share.

Have a great day!
