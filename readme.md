# Student Portal API Documentation

## Introduction
This document provides information on the routes and controllers for the Student Portal API. It is intended for frontend developers who will be working with these endpoints to build the user interface for the student portal.

## Authentication

### 1. Login
- **Route:** `POST /login`
- **Controller:** `studentController.login`
- **Description:** Allows a student to log in using their username, password, and date of birth. Returns an access token upon successful login.

### Request Body

```json
{
  "username": "exampleUsername",
  "password": "examplePassword",
  "dob": "1990-01-01"
}
```

This JSON object contains the `username`, `password`, and `dob` (Date of Birth) fields.

### Response Body (Successful Login)

```json
{
  "message": "Login Successful",
  "name": "John Doe"
}
```

In this case, the server responds with a success message and the name of the logged-in user.

### Response Body (Failed Login)

```json
{
  "message": "Invalid Credentials"
}
```

If the login attempt fails (e.g., due to incorrect username, password, or date of birth), the server responds with an error message indicating "Invalid Credentials."

Feel free to copy and paste these Markdown sections into your README file. Adjust the content as needed based on the specifics of your application.

## Student Information

### 2. Attendance
- **Route:** `GET /attendance`
- **Middleware:** `auth`
- **Controller:** `studentController.attendance`
- **Description:** Retrieves attendance details for the logged-in student.

**Request Body:** None required

**Response Body:**
```json
[
  {
    "subject": "Math",
    "attendance": [
      {
        "date": "2024-02-10",
        "attended": true,
        "isAc": false
      },
      {
        "date": "2024-02-11",
        "attended": false,
        "isAc": true
      }
      // More attendance records...
    ],
    "totalClasses": 20,
    "totalPresent": 15
  },
  // More subjects...
]
```

### 3. Assignment
- **Route:** `GET /assignment`
- **Middleware:** `auth`
- **Controller:** `studentController.assignment`
- **Description:** Retrieves assignment details for the logged-in student.

**Request Body:** None required

**Response Body:**
```json
{
  "assignment": [
    {
      "title": "Assignment 1",
      "subject": "Math",
      "teacher": "John Doe",
      "dueDate": "2024-02-20"
    },
    // More assignments...
  ]
}
```


### 4. Event
- **Route:** `GET /event`
- **Controller:** `studentController.event`
- **Description:** Retrieves upcoming events for all students.

**Request Body:** None required

**Response Body:**
```json
{
  "event": [
    {
      "title": "Science Fair",
      "date": "2024-02-25",
      "location": "Auditorium",
      "description": "Annual science exhibition showcasing student projects."
    },
    // More events...
  ]
}
```

### 5. Subject
- **Route:** `GET /subject`
- **Middleware:** `auth`
- **Controller:** `studentController.subject`
- **Description:** Retrieves subjects assigned to the logged-in student.

**Request Body:** None required

**Response Body:**
```json
{
  "subject": "Math"
}
```

### 6. Timetable
- **Route:** `GET /timetable`
- **Middleware:** `auth`
- **Controller:** `studentController.timetable`
- **Description:** Retrieves timetable details for the logged-in student.

**Request Body:** None required

**Response Body:**
```json
{
  "timetable": "https://example.com/timetable"
}
```

## Student Profile

### 7. Personal Information
- **Route:** `GET /profile/personalInfo`
- **Middleware:** `auth`
- **Controller:** `studentController.personalInfo`
- **Description:** Retrieves personal information for the logged-in student.

**Request Body:** None required

**Response Body:**
```json
{
  "studentPersonalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1998-05-15",
    "gender": "Male",
    "address": "123 Main St, Cityville, XYZ"
  }
}
```


### 8. Contact Details
- **Route:** `GET /profile/contactDetails`
- **Middleware:** `auth`
- **Controller:** `studentController.contactDetails`
- **Description:** Retrieves contact details for the logged-in student.

**Request Body:** None required

**Response Body:**
```json
{
  "studentContactDetails": {
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Mother",
      "phone": "+1987654321"
    }
  }
}
```

### 9. Parent/Guardian Information
- **Route:** `GET /profile/parentInfo`
- **Middleware:** `auth`
- **Controller:** `studentController.guardianInfo`
- **Description:** Retrieves parent/guardian information for the logged-in student.

**Request Body:** None required

**Response Body:**
```json
{
  "studentGuardianInfo": {
    "guardianName": "Jane Doe",
    "relationship": "Mother",
    "email": "jane.doe@example.com",
    "phone": "+1987654321"
  }
}
```

### 10. Awards and Achievements
- **Route:** `GET /profile/awards`
- **Middleware:** `auth`
- **Controller:** `studentController.awardsAndAchievements`
- **Description:** Retrieves awards and achievements for the logged-in student.

**Request Body:** None required

**Response Body:**
```json
{
  "studentGuardianInfo": {
    "guardianName": "Jane Doe",
    "relationship": "Mother",
    "email": "jane.doe@example.com",
    "phone": "+1987654321"
  }
}
```

### 11. Documents
- **Route:** `GET /profile/documents`
- **Middleware:** `auth`
- **Controller:** `studentController.documents`
- **Description:** Retrieves documents uploaded by the logged-in student.

**Request Body:** None required

**Response Body:**
```json
{
  "studentGuardianInfo": {
    "guardianName": "Jane Doe",
    "relationship": "Mother",
    "email": "jane.doe@example.com",
    "phone": "+1987654321"
  }
}
```

### 12. Upload Document
- **Route:** `POST /profile/document:documentType`
- **Middleware:** `auth`, `upload.single('document')`
- **Controller:** `studentController.uploadDocument`
- **Description:** Uploads a document of a specific type for the logged-in student.

**Request Body:** None Required 


**Request Body:**
```json

```