# Agency Contact Dashboard

A Next.js application for managing and viewing agency and employee contact information, featuring authentication, daily view limits, and optimized data loading.

## 🚀 Features

*   **Authentication:** Secure user authentication using [Clerk](https://clerk.com/).
*   **Daily View Limits:** Users are limited to viewing **50 contacts per day**.
    *   **Log Book Tracking:** Uses a database table to track unique contact views per user per day.
    *   **Duplicate Protection:** Viewing the same contact multiple times in one day does not consume additional credits.
    *   **Hard Block:** Navigation is restricted past the limit.
*   **Optimized Performance:**
    *   **Lazy Loading:** Data is fetched in chunks (Pagination) to reduce initial load time.
    *   **Session Caching:** Visited pages are cached in the browser session for instant navigation without re-fetching.
*   **Data Visualization:** Clean, responsive tables for Agencies and Contacts.

## 🛠️ Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Database:** MySQL (AWS RDS)
*   **Auth:** Clerk
*   **Styling:** Tailwind CSS

## 🗄️ Database Architecture

The application uses a MySQL database with the following key tables:

### 1. `agencies`
Stores agency information.
*   `id` (Primary Key)
*   `name`, `state`, `type`, `population`, etc.

### 2. `contacts`
Stores employee contact information linked to agencies.
*   `id` (Primary Key)
*   `first_name`, `last_name`, `email`, `phone`, etc.
*   `agency_id` (Foreign Key)

### 3. `user_contact_views` (Limit Tracking)
Tracks which contacts a user has viewed today.
*   `id` (Primary Key)
*   `user_id` (VARCHAR): The Clerk User ID.
*   `contact_id` (VARCHAR): The ID of the contact viewed.
*   `viewed_at` (TIMESTAMP): When the view occurred.
*   **Unique Constraint:** `(user_id, contact_id, DATE(viewed_at))` ensures a user is only charged once per contact per day.

#### SQL to Create Tracking Table:
```sql
CREATE TABLE IF NOT EXISTS user_contact_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    contact_id VARCHAR(255) NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_date (user_id, viewed_at),
    UNIQUE KEY unique_user_contact_day (user_id, contact_id, DATE(viewed_at))
);
```

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database Connection (AWS RDS / MySQL)
DB_HOST=your-db-host.rds.amazonaws.com
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=agency_db
DB_PORT=3306
```

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/agency-contact-dashboard.git
    cd agency-contact-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    *   Ensure your MySQL database is running.
    *   Run the SQL command mentioned above to create the `user_contact_views` table.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## 🧠 Key Logic Explanation

### The "Log Book" Limit System
Instead of a simple countdown number (e.g., "User has 40 views left"), we log every single contact view.
*   **Why?** This prevents "double charging". If a user refreshes the page or navigates back to a previous page, the system sees they have *already* viewed those specific contacts today and does not decrease their limit again.

### Session Caching
To make the app feel instant, we use `sessionStorage`.
*   **Flow:** Fetch Page 1 -> Save to Cache -> User goes to Page 2 -> User goes back to Page 1 -> **Load from Cache (Instant)**.
*   **Sync:** Even when loading from cache, we silently fetch the latest "Remaining Views" count in the background to ensure the counter is always accurate.