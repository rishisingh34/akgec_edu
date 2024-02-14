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
    "username" : "22153048194",
    "password" : "rishi",
    "dob" : "20-07-2004"
}
```

This JSON object contains the `username`, `password`, and `dob` (Date of Birth) fields.

### Response Body (Successful Login)

```json
{
    "message": "Login Successful",
    "name": "Rishi Raj Singh"
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

**Request Body:** Token in Cookies is required for authentication

**Response Body:**
```json
[
    {
        "totalClasses": 4,
        "totalPresent": 4,
        "attendance": [
            {
                "date": "2024-01-27",
                "attended": true,
                "isAc": false
            },
            {
                "date": "2024-02-02",
                "attended": true,
                "isAc": false
            },
            {
                "date": "2024-02-04",
                "attended": true,
                "isAc": false
            },
            {
                "date": "2024-02-04",
                "attended": true,
                "isAc": false
            }
        ],
        "subject": "Web Designing"
    },
    {
        "totalClasses": 2,
        "totalPresent": 2,
        "attendance": [
            {
                "date": "2024-01-25",
                "attended": false,
                "isAc": true
            },
            {
                "date": "2024-01-27",
                "attended": true,
                "isAc": false
            }
        ],
        "subject": "COA"
    }
    // More Subjects... 
]
```

### 3. Assignment
- **Route:** `GET /assignment`
- **Middleware:** `auth`
- **Controller:** `studentController.assignment`
- **Description:** Retrieves assignment details for the logged-in student.

**Request Body:** Token in Cookies is required for authentication

**Response Body:**
```json
{
    "assignment": [
        {
            "subject": {
                "name": "DSTL",
                "code": "BCS303"
            },
            "assignment": "https://example.com/assignment1.pdf",
            "deadline": "25-02-2024",
            "description": "hjedgcyUAGD YWBZNBIFlkjfhygftsgdtyew ",
            "teacher": {
                "name": "Dr. Harnit Saini"
            }
        },
        {
            "subject": {
                "name": "DSTL",
                "code": "BCS303"
            },
            "assignment": "https://example.com/assignment2.pdf",
            "deadline": "31-02-2024",
            "description": "hdyuggedynfuvniasvdhngw,chnfyugsufjdn",
            "teacher": {
                "name": "Dr. Harnit Saini"
            }
        },
        {
            "subject": {
                "name": "Data Structure",
                "code": "BCS301"
            },
            "assignment": "https://example.com/assignment3.pdf",
            "deadline": "22-02-2024",
            "description": "kjihdjosqwdugbaeORJJJJXIGWYFgfugewuffhgytf6iuegfywydew6t",
            "teacher": {
                "name": "Dr. Ekta Pandey"
            }
        },
        {
            "subject": {
                "name": "Python",
                "code": "BCC302"
            },
            "assignment": "https://example.com/assignment4.pdf",
            "deadline": "30-02-2024",
            "description": "jbsahdgyucyvchsvcscyvcsctyagxyushaiugxyx",
            "teacher": {
                "name": "Dr. Ekta Pandey"
            }
        }
    ]
}
```


### 4. Event
- **Route:** `GET /event`
- **Controller:** `studentController.event`
- **Description:** Retrieves upcoming events for all students.

**Request Body:** Token in cookies required for authentication

**Response Body:**
```json
{
    "event": [
        {
            "_id": "65bd10590b2169b2a959de59",
            "hostingOrganization": "Computer Society Of India",
            "eventName": "CINE 24",
            "date": "2024-02-10",
            "event": "recruitment drive",
            "registrationUrl": "https://csiakgec.in",
            "detail": "This is the first event."
        },
        {
            "_id": "65bd10590b2169b2a959de5a",
            "hostingOrganization": "Organization B",
            "eventName": "Event 2",
            "date": "2024-03-15",
            "event": "Conference",
            "registrationUrl": "https://example.com/event2",
            "detail": "This is the second event."
        },
        // More Events ..... 
    ]
}
```

### 5. Subject
- **Route:** `GET /subject`
- **Middleware:** `auth`
- **Controller:** `studentController.subject`
- **Description:** Retrieves subjects assigned to the logged-in student.

**Request Body:** Token(Cookies ) required for Authentication

**Response Body:**
```json
{
    "subject": [
        {
            "_id": "65bcd7cf17836f9faed0b9b8",
            "name": "Data Structure",
            "code": "BCS301"
        },
       // More Subjects.... 
    ]
}
```

### 6. Timetable
- **Route:** `GET /timetable`
- **Middleware:** `auth`
- **Controller:** `studentController.timetable`
- **Description:** Retrieves timetable details for the logged-in student.

**Request Body:** Token(Cookies) required for Authentication 

**Response Body:**
```json
{
    "timetable": "https://res.cloudinary.com/dw6jj0t6z/image/upload/v1707914664/z5dzyhtfafwkatnbsncq.png"
}
```

## Student Profile

### 7. Personal Information
- **Route:** `GET /profile/personalInfo`
- **Middleware:** `auth`
- **Controller:** `studentController.personalInfo`
- **Description:** Retrieves personal information for the logged-in student.

**Request Body:** Token required for Authentication 

**Response Body:**
```json
{
    "personalInfo": {
        "_id": "65cd484be736507cfd0188d9",
        "name": "Rishi Raj Singh",
        "gender": "Male",
        "dob": "2004-07-20",
        "courseName": "Engineering",
        "admissionDate": "2023-09-01",
        "branch": "CSE AIML",
        "semester": 3,
        "admissionMode": "Entrance Exam",
        "section": "CSE AIML 2",
        "category": "General",
        "domicileState": "State A",
        "jeeRank": "77676",
        "jeeRollNo": "ABCDE123",
        "lateralEntry": "No",
        "hostel": "Yes"
    }
}
```


### 8. Contact Details
- **Route:** `GET /profile/contactDetails`
- **Middleware:** `auth`
- **Controller:** `studentController.contactDetails`
- **Description:** Retrieves contact details for the logged-in student.

**Request Body:** Token(Cookies) required for Authentication 

**Response Body:**
```json
{
    "contactDetails": {
        "_id": "65cd493ee736507cfd0188fb",
        "email": "example1@example.com",
        "mobNo": "+1234567890",
        "alternateEmail": "alt1@example.com",
        "alternateMobNo": "+9876543210",
        "permanentAddress": "123 Main St",
        "presentAddress": "456 Elm St",
        "permanentPincode": "12345",
        "presentPincode": "54321",
        "permanentState": "State1",
        "presentState": "State2",
        "permanentCountry": "Country1",
        "presentCountry": "Country2"
    }
}
```

### 9. Parent/Guardian Information
- **Route:** `GET /profile/parentInfo`
- **Middleware:** `auth`
- **Controller:** `studentController.guardianInfo`
- **Description:** Retrieves parent/guardian information for the logged-in student.

**Request Body:** Token(Cookies) required for Authentication 

**Response Body:**
```json
{
    "parentsInfo": {
        "_id": "65cd485de736507cfd0188e4",
        "fatherName": "Dhirendra Kumar",
        "motherName": "Vibha Singh",
        "fatherMobNo": "1234567890",
        "motherMobNo": "0987654321",
        "emailFather": "j.doe@example.com",
        "emailMother": "j.doe@example.com",
        "aadharNoFather": "1234 5678 9012",
        "aadharNoMother": "9876 5432 1098",
        "occupationFather": "Advocate",
        "occupationMother": "Advocate",
        "address": "123 Main Street, City, Country"
    }
}
```

### 10. Awards and Achievements
- **Route:** `GET /profile/awards`
- **Middleware:** `auth`
- **Controller:** `studentController.awardsAndAchievements`
- **Description:** Retrieves awards and achievements for the logged-in student.

**Request Body:** Token(Cookies) required for Authentication 

**Response Body:**
```json
{
    "awardsAndAchievements": {
        "_id": "65cd49cfe736507cfd018903",
        "studentId": "12345",
        "awardName": "Science Fair First Prize",
        "awardDescription": "Awarded first prize for innovative project in the annual science fair.",
        "awardDate": "2023-05-20",
        "awardImgUrl": "https://example.com/awards/science_fair.jpg"
    }
}
```

### 11. Documents
- **Route:** `GET /profile/documents`
- **Middleware:** `auth`
- **Controller:** `studentController.documents`
- **Description:** Retrieves documents uploaded by the logged-in student.

**Request Body:** Token(Cookies) required for Authentication 

**Response Body:**
```json
{

}
```

### 12. Upload Document
- **Route:** `POST /profile/document:documentType`
- **Middleware:** `auth`, `upload.single('document')`
- **Controller:** `studentController.uploadDocument`
- **Description:** Uploads a document of a specific type for the logged-in student.

**Request Body:** Token(Cookies) required for Authentication  


**Request Body:**
```json
{
  "message": "Document uploaded successfully"
}
```