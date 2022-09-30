# Local List
Backend for local list app

backend-URL = https://locallistbackend.azurewebsites.net/

Frontend-URL (Visit this one)   = https://hyper-local-shopping.netlify.app/

## Outsource Shopping
Create a shopping list and let others shop for you.

OR

Shop for others to earn extra pocket money

## Local setup
the backend requires following env variables
### ENV
**NODE_ENV**: dev/production - if dev OTP verification will be bypassed, all OTP will considered valid.
### For Twilio verify
- **TWILLIO_TOKEN**: 
- **ID**: 
- **SERVICE**:
### For JWT
- **JWT_SECRET**: key with which JWT token will be signed, to be kept secret, access token expires in 2h
- **REFRESH_SECRET**: key with which Refresh token will be signed, doesn't expire, use to regenerate JWT.
### For Refresh token storage
- **REDIS**: url of redis service in the format 
    `username:password@url:port` hardwired to connect with `rediss` protocol ensure your db supports it.
- **USE_REDIS**: [Defaults to _false_ ] if true if use redis to store refresh token, else will store tokens in-memory object.
### Primary DataBase
**MONGO_URL**: Url of mongoDB
### Frontend
**frontend**: Url where frontend is hosted, puts the frontend in CORS allow list & redirects to the frontend.


