import { Hono } from 'hono';
import { sValidator } from '@hono/standard-validator';
import { registerUser, loginUser, refreshAccessToken } from "./service.js";
import { CreateUserSchema, LoginSchema, RefreshTokenSchema } from "./schemas.js";

const auth = new Hono();

auth.post('/register', sValidator('json', CreateUserSchema), async (c) => {
  const params = c.req.valid('json');
  const user = await registerUser(params);
  return c.json(user, 201);
});

auth.get('/register/success', (c) => {
  const username = c.req.query('username') || 'User';
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Successful</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 16px;
          padding: 48px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        .icon svg {
          width: 40px;
          height: 40px;
          fill: white;
        }
        h1 {
          color: #1a1a2e;
          font-size: 28px;
          margin-bottom: 16px;
          font-weight: 600;
        }
        p {
          color: #64748b;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .highlight {
          color: #667eea;
          font-weight: 600;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px rgba(102, 126, 234, 0.5);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
        <h1>Welcome, <span class="highlight">${username}</span>!</h1>
        <p>Thank you for registration!</p>
        <a href="/login" class="btn">Go to Login</a>
      </div>
    </body>
    </html>
  `;
  return c.html(html);
});

auth.post('/login', sValidator('json', LoginSchema), async (c) => {
  const params = c.req.valid('json');
  const result = await loginUser(params);
  return c.json(result);
});

auth.post('/refresh', sValidator('json', RefreshTokenSchema), async (c) => {
  const params = c.req.valid('json');
  const result = await refreshAccessToken(params);
  return c.json(result);
});

export default auth;
