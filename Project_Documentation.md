# College Timetable Scheduling App - Project Guide

Welcome to your project! As a beginner, it's completely normal to feel overwhelmed by multiple files. This document explains exactly how your application works, file by file. It is designed so you can export it to a PDF and submit it as your project documentation.

---

## 1. Overview and Technologies
This web application allows a college administrator to manage classrooms, teachers (faculty), student groups (divisions), and time slots, and then automatically checks for clashes (conflicts) when scheduling a class.

**Technologies Used:**
*   **React:** The core library used to build the User Interface (UI).
*   **TypeScript (`.ts`, `.tsx`):** A stricter version of JavaScript that helps catch errors before running the code.
*   **Tailwind CSS:** A utility-first CSS framework used for styling the app beautifully.
*   **Vite:** The incredibly fast build tool that runs your local development server.
*   **LocalStorage:** The browser's built-in storage used to save data so it isn't lost when you refresh the page (acting as a backend database).

---

## 2. Main Entry Files

### `index.html`
This is the single HTML page that the browser loads. It contains a single `<div id="root"></div>`. React takes over this `div` and draws everything inside of it.

### `src/main.tsx`
This is the starting point of the React application. It grabs the `root` div from the HTML and injects your very first React component (`<App />`) into it.

### `src/App.tsx`
This is the "shell" of your application. Think of it as the container that holds the entire screen. 
*   It checks if you are logged in.
*   It displays the **Sidebar** and the **Top Navigation Bar** (with the bell notification icon).
*   It acts as a router: it looks at what page you clicked on the sidebar and decides which specific component (like `ClassroomPage` or `TimetablePage`) to display in the main content area.

---

## 3. The Database Layer

### `src/store/db.ts`
Since this app doesn't have a separate backend server (like Node.js/Python) or database (like MySQL/MongoDB), all the data is saved directly in the user's browser using `localStorage`.

*   **Interfaces (Types):** The top of the file defines the "shape" of data. For example, a `Classroom` must have an `id`, a `name`, and a `capacity`.
*   **CRUD Operations:** It contains functions to **C**reate, **R**ead, **U**pdate, and **D**elete lists. Examples: `getFaculty()`, `addClassroom()`, `deleteTimeslot()`.
*   **Conflict Detection:** The `scheduleLecture()` function is the "brain" of the app. Before saving a lecture, it checks the database to ensure that the teacher isn't teaching another class, the room isn't occupied, and the students aren't busy at that same time.
*   **Seed Data:** The `seedData()` function puts fake, starting data (like "Prof. Jupinder Kaur" and "Room 2403") into the app the very first time you open it so the app isn't completely empty.

---

## 4. UI Components

### `src/components/Login.tsx`
A simple screen that prevents access until the user types the correct username and password (`admin` / `admin`).

### `src/components/Sidebar.tsx`
The left-hand menu. It contains buttons for every page in the app and tells `App.tsx` to switch the view when a button is clicked.

### Management Pages (`FacultyPage.tsx`, `DivisionPage.tsx`, `ClassroomPage.tsx`, `TimeslotPage.tsx`)
These four pages are structurally very similar. They are "CRUD interfaces" (Create, Read, Update, Delete).
*   They call `getFaculty()` (or similar) from `db.ts` to get a list of items and display them as cards.
*   They contain an "Add New" button that reveals a small form to add new items.
*   They contain a search bar to filter the lists dynamically.

### `src/components/SchedulePage.tsx`
This is the most complex data-entry page. 
*   It fetches all the items you created in the management pages and displays them in dropdown menus.
*   When you click "Schedule", it sends all the data to the `scheduleLecture` function in our makeshift database (`db.ts`).
*   If `db.ts` returns a success, the UI shows a green checkmark. If it returns a clash/conflict error, the UI displays exactly what the conflict was (e.g., "Room 2403 is already occupied") and suggests free time slots!

### `src/components/TimetablePage.tsx`
This page takes all the successfully scheduled lectures and maps them onto a visual Weekly Calendar Grid. 
*   It uses HTML tables to render the days of the week and the available time slots.
*   It cross-references the time slot IDs and places colorful lecture cards in the correct table cells.

---

## 5. How Data Flows (Summary)
1. You run the app (`npm run dev`).
2. `main.tsx` loads `App.tsx`.
3. `App.tsx` calls `seedData()` from `db.ts` to ensure there is starting data in the browser.
4. You click on "Classrooms" in the `Sidebar.tsx`.
5. `App.tsx` renders `ClassroomPage.tsx`.
6. `ClassroomPage.tsx` reads data from `db.ts` and displays it.
7. You add a lecture in `SchedulePage.tsx` which asks `db.ts` to check for conflicts before saving.
8. Because `db.ts` uses `localStorage`, all your edits remain safely saved even if you close the web browser!
