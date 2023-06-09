# rtcollab-draw-fyp

#### Purpose

design a simple real-time collaborative drawing application

#### Content

1. real-time drawing in ./public/workspace (frontend)
2. auth control (backend + frontend)
3. picture upload for workspace in ./public/workspace (backend + frontend)

### To run the system

1. run npm install to download all the dependencies
2. create a '.env' file
3. set up MONGO_URI, JWT_SECRET and JWT_LIFETIME

### Set Up Instructions

MONGO_URI: (a string for server to connect to mongoDB)

1. create/login mongodb account on 'https://account.mongodb.com/account/login'
2. create a database for the project
3. get the connection string from the database connect selection
4. Example: MONGO_URI=mongodb+srv...

JWT_SECRET: (a string for JWT generation)

1. get your own secret key in string type
2. can get a generated key from 'https://www.allkeysgenerator.com/'
3. Example: JWT_SECRET=cf1c917b2dff4e9a8ded4b6ccbf232b7

JWT_LIFETIME: (set a duration for JWT to get expired)

1. Example: JWT_LIFETIME=30d
