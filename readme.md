# Student Portal API Documentation

## Introduction
This document provides information on the routes and controllers for the Student Portal API. It is intended for frontend developers who will be working with these endpoints to build the user interface for the student portal.

## Authentication

### 1. Login
- **Route:** `POST /login`
- **Controller:** `studentController.login`
- **Description:** Allows a student to log in using their username, password, and date of birth. Returns an access token upon successful login.


## Student Information

### 2. Attendance
- **Route:** `GET /attendance`
- **Middleware:** `auth`
- **Controller:** `studentController.attendance`
- **Description:** Retrieves attendance details for the logged-in student.


### 3. Assignment
- **Route:** `GET /assignment`
- **Middleware:** `auth`
- **Controller:** `studentController.assignment`
- **Description:** Retrieves assignment details for the logged-in student.


### 4. Event
- **Route:** `GET /event`
- **Controller:** `studentController.event`
- **Description:** Retrieves upcoming events for all students.


### 5. Subject
- **Route:** `GET /subject`
- **Middleware:** `auth`
- **Controller:** `studentController.subject`
- **Description:** Retrieves subjects assigned to the logged-in student.


### 6. Timetable
- **Route:** `GET /timetable`
- **Middleware:** `auth`
- **Controller:** `studentController.timetable`
- **Description:** Retrieves timetable details for the logged-in student.


## Student Profile

### 7. Personal Information
- **Route:** `GET /profile/personalInfo`
- **Middleware:** `auth`
- **Controller:** `studentController.personalInfo`
- **Description:** Retrieves personal information for the logged-in student.


### 8. Contact Details
- **Route:** `GET /profile/contactDetails`
- **Middleware:** `auth`
- **Controller:** `studentController.contactDetails`
- **Description:** Retrieves contact details for the logged-in student.


### 9. Parent/Guardian Information
- **Route:** `GET /profile/parentInfo`
- **Middleware:** `auth`
- **Controller:** `studentController.guardianInfo`
- **Description:** Retrieves parent/guardian information for the logged-in student.


### 10. Awards and Achievements
- **Route:** `GET /profile/awards`
- **Middleware:** `auth`
- **Controller:** `studentController.awardsAndAchievements`
- **Description:** Retrieves awards and achievements for the logged-in student.


### 11. Documents
- **Route:** `GET /profile/documents`
- **Middleware:** `auth`
- **Controller:** `studentController.documents`
- **Description:** Retrieves documents uploaded by the logged-in student.


### 12. Upload Document
- **Route:** `POST /profile/document:documentType`
- **Middleware:** `auth`, `upload.single('document')`
- **Controller:** `studentController.uploadDocument`
- **Description:** Uploads a document of a specific type for the logged-in student.

