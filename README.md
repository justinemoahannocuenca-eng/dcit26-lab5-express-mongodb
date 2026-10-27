# DCIT 26 Laboratory 5: Express and MongoDB

Student Records REST API built with Node.js, Express, MongoDB, and Mongoose.

## Requirements

- Node.js and npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- Postman, Thunder Client, or curl (for testing)

## Project structure

```text
dcit26-lab5-express-mongodb/
├── backend/
│   ├── models/
│   │   └── Student.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Setup on Windows / VS Code

1. Open this folder in VS Code.
2. Open **Terminal > New Terminal**.
3. Confirm Node.js and npm are installed:

   ```powershell
   node -v
   npm -v
   ```

4. Install the packages:

   ```powershell
   npm install
   ```

5. Create your local `.env` file by copying the example in PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

6. Make sure MongoDB is running locally. The default URI is:

   ```text
   mongodb://127.0.0.1:27017/lab5_students
   ```

   If you use MongoDB Atlas, replace `MONGODB_URI` in `.env` with your Atlas connection string. Do not commit `.env`.

7. Start the development server:

   ```powershell
   npm run dev
   ```

   The server starts at `http://localhost:5000` only after MongoDB connects.

## Health check

Send `GET http://localhost:5000/api/health`. Expected response:

```json
{
  "status": "ok",
  "message": "Student Records API is running"
}
```

## API routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check whether the API is running |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get one student by MongoDB ID |
| POST | `/api/students` | Create a student (returns 201) |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Sample JSON body

Use **Body > raw > JSON** in Postman or Thunder Client:

```json
{
  "fullName": "Alex Santos",
  "course": "BSIT",
  "yearLevel": 2,
  "section": "IT-2A"
}
```

For `PUT`, send the fields you want to update using the same JSON format. Fields omitted from the request are not changed.

## Testing with PowerShell

Replace `<ID>` with the `_id` returned from a successful POST request.

```powershell
# Health check
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/api/health"

# Create
$body = @{
  fullName = "Alex Santos"
  course = "BSIT"
  yearLevel = 2
  section = "IT-2A"
} | ConvertTo-Json
$created = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/students" -ContentType "application/json" -Body $body
$created
$id = $created._id

# Read all
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/api/students"

# Read one
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/api/students/$id"

# Update
$updateBody = @{
  fullName = "Alex Santos Updated"
  course = "BSIT"
  yearLevel = 2
  section = "IT-2A"
} | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "http://localhost:5000/api/students/$id" -ContentType "application/json" -Body $updateBody

# Delete
Invoke-RestMethod -Method Delete -Uri "http://localhost:5000/api/students/$id"
```

Run each command separately. Save screenshots of successful GET, POST, PUT, and DELETE requests for submission. Also capture the collection in MongoDB Compass or output from `mongosh`.

## MongoDB Compass verification

1. Open MongoDB Compass.
2. Connect to `mongodb://127.0.0.1:27017`.
3. Open the `lab5_students` database.
4. Open the `students` collection. Documents should remain after restarting the API because MongoDB is the data store.

## Error responses

- `400 Bad Request`: invalid student data, invalid MongoDB ID, or malformed JSON
- `404 Not Found`: student record or route does not exist
- `500 Internal Server Error`: unexpected server-side problem

The API does not return stack traces to clients.

## GitHub submission

Create a public or instructor-approved private repository named `dcit26-lab5-express-mongodb`. From the project folder:

```powershell
git init
git add .
git status
git commit -m "Complete DCIT 26 Laboratory 5 Express and MongoDB"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/dcit26-lab5-express-mongodb.git
git push -u origin main
```

Replace the remote URL with your actual repository URL. Check `git status` and confirm `.env` is not listed before committing. Submit the repository URL and required screenshots.
