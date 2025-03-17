# FireArt Skeleton Challenge - Arman Lukac

Demo / test app for FireArt Studio

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Simple test backend application developed for the purposes of test task, for FireArt Studio.

Functionalities applied:
Authentication Flow

- Signup, login, logout and password reset using token-based authentication.
- Email verification using token, or OTP straight from the request.
- Password reset using email, or OTP.

Entity Management

- Create, Read, Search, Update, and Delete (CRUD) operations via API.
- Secure all entity operations with authentication.

Find [repository](https://github.com/armanlukac/fireArt-skeleton-challenge) attached to the link.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Local Deployment

Getting started with this project is easy. Just make sure you have all following installed and configured:

- Node.js
- Typescript
- Nest.js CLI
- PostgreSQL

Clone the repository provided at the top of this file, and install all dependencies.

For local usage, create ENV file in your repository and paste all following variables.

## ENV Variables

```bash
PORT=3000
DB_HOST=pg-19951df-skeleton-challenge.c.aivencloud.com
DB_PORT=27062
DB_USER=avnadmin
DB_PASSWORD=AVNS_1bBTu5YxrgTjnbTfCdZ
DB_NAME=defaultdb
DB_SSL=require # Aiven requires SSL to connect
#  JWT generated with crypto, 64 bytes
JWT_SECRET=38d5267bbe5b78cfb6b418c85209309dc7a85e0f1b58bf14549bbb68723bdc99058ddbe6b2dd3b90026f096665b62ebf7ab69866908af83bf7f72cc2ec99aaf9
JWT_EXPIRES_IN=3600s
# Resend credentials
RESEND_API_KEY=re_3UgBtpbM_DiP2xnHdzBsYpvZCVPhe7BpM
EMAIL_FROM=skeleton-challenge@armanlukac.com
# Local
EMAIL_VERIFICATION_URL=http://localhost:3000/auth/verify-email
PASSWORD_RESET_URL=http://localhost:3000/reset-password
# Heroku
# EMAIL_VERIFICATION_URL=https://skeleton-challenge-182da640f861.herokuapp.com/auth/verify-email
# PASSWORD_RESET_URL=https://skeleton-challenge-182da640f861.herokuapp.com/reset-password
```

PostgreSQL database is deployed in [Aiven](https://aiven.io),

## Deployment to Heroku

- Create a Heroku app
  1.  Go to Heroku and log in.
  2.  Click “New” > “Create new app”.
  3.  Enter an app name (must be unique).
  4.  Choose a region (United States or Europe).
  5.  Click “Create App”.
- Connect Your GitHub Repository
  1.  In the Heroku app dashboard, go to the “Deploy” tab.
  2.  Scroll to “Deployment method” and select GitHub.
  3.  Click “Connect to GitHub” and authorize Heroku.
  4.  Find your NestJS repository and click “Connect”.
- Set Environment Variables
  1.  In your Heroku dashboard, go to “Settings”.
  2.  Click “Reveal Config Vars”.
  3.  Add all variables from the .env above
- Configure main.ts for Heroku

  1. Modify src/main.ts to use Heroku’s port:

  ```bash
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors(); // Allow CORS
    const PORT = process.env.PORT || 3000; // Use Heroku's provided port
    await app.listen(PORT);
  }
  bootstrap();
  ```

- Deploy to Heroku from GitHub
  1. Go back to the Deploy tab in Heroku.
  2. In “Automatic Deploys”, click “Enable Automatic Deploys” (optional).
  3. In “Manual Deploy”, click “Deploy Branch”.
- Check your deployment
  Once deployed, find your app URL in Settings > Domains.
  Test Your API

```bash
curl https://your-app-name.herokuapp.com/
```

## Stay in touch

- Author - [Arman Lukac](https://www.linkedin.com/in/arman-lukac/)
