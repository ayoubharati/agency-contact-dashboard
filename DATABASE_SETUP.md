# Aurora MySQL Database Setup Guide

This guide will help you set up and connect your Next.js dashboard to Aurora MySQL database.

## Prerequisites

- Aurora MySQL database running on AWS
- Database credentials (host, username, password)
- CSV files with agencies and contacts data

## Step 1: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your database credentials:
   ```env
   DB_HOST=agency-contact-db.choeme4iywve.eu-central-1.rds.amazonaws.com
   DB_USER=admin
   DB_PASSWORD=your_actual_password
   DB_NAME=agency_contact_db
   ```

3. Keep your existing Clerk environment variables in the `.env` file.

## Step 2: Create Database Schema

1. Connect to your Aurora MySQL database:
   ```bash
   mysql --local-infile=1 -h agency-contact-db.choeme4iywve.eu-central-1.rds.amazonaws.com -u admin -p
   ```

2. Run the schema file to create tables:
   ```sql
   SOURCE database/schema.sql;
   ```

   Or manually execute the SQL commands from `database/schema.sql`.

## Step 3: Import CSV Data

### Option A: Using LOAD DATA LOCAL INFILE (Recommended)

1. Make sure you're connected with `--local-infile=1` flag

2. Import agencies data:
   ```sql
   USE agency_contact_db;
   
   LOAD DATA LOCAL INFILE 'app/data/agencies_agency_rows.csv'
   INTO TABLE agencies
   FIELDS TERMINATED BY ',' 
   ENCLOSED BY '"'
   LINES TERMINATED BY '\n'
   IGNORE 1 ROWS;
   ```

3. Import contacts data:
   ```sql
   LOAD DATA LOCAL INFILE 'app/data/contacts_contact_rows.csv'
   INTO TABLE contacts
   FIELDS TERMINATED BY ',' 
   ENCLOSED BY '"'
   LINES TERMINATED BY '\n'
   IGNORE 1 ROWS;
   ```

### Option B: Using a Script

You can also create a Node.js script to import the CSV data programmatically if LOAD DATA LOCAL INFILE doesn't work.

## Step 4: Verify Data Import

Check that data was imported successfully:

```sql
-- Check agencies count
SELECT COUNT(*) FROM agencies;

-- Check contacts count
SELECT COUNT(*) FROM contacts;

-- View sample data
SELECT * FROM agencies LIMIT 5;
SELECT * FROM contacts LIMIT 5;
```

## Step 5: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Sign in and verify:
   - Dashboard shows correct agency and contact counts
   - Agencies page loads data from database
   - Contacts page loads data from database
   - Contact viewing limit still works

## Database Schema

### Agencies Table
- `id` (VARCHAR 36, PRIMARY KEY)
- `name`, `state`, `state_code`, `type`
- `population`, `website`, `total_schools`, `total_students`
- `mailing_address`, `physical_address`, `phone`
- `county`, `locale`, `grade_span`
- `created_at`, `updated_at` (TIMESTAMP)

### Contacts Table
- `id` (VARCHAR 36, PRIMARY KEY)
- `first_name`, `last_name`, `email`, `phone`
- `title`, `department`, `email_type`
- `agency_id` (FOREIGN KEY to agencies)
- `created_at`, `updated_at` (TIMESTAMP)

## Deploying to AWS Amplify

When deploying to AWS Amplify:

1. Add environment variables in Amplify Console:
   - Go to App Settings > Environment variables
   - Add: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - Add your Clerk variables as well

2. Ensure your Aurora database security group allows connections from Amplify

3. Consider using AWS Secrets Manager for database credentials

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Check security group rules allow inbound connections on port 3306
2. Verify database endpoint is correct
3. Ensure database is publicly accessible (or use VPC if in same VPC)
4. Check username and password are correct

### Import Issues

If CSV import fails:

1. Verify CSV file paths are correct
2. Check CSV format matches expected structure
3. Try importing a few rows first to test
4. Check for special characters or encoding issues

### Application Errors

If the app shows errors after migration:

1. Check `.env` file has all required variables
2. Restart the development server
3. Check browser console for specific errors
4. Verify database connection in server logs

## Performance Optimization

For production:

1. **Indexes**: The schema includes indexes on commonly queried fields
2. **Connection Pooling**: Already configured with 10 connections max
3. **Caching**: Consider adding Redis for frequently accessed data
4. **Read Replicas**: Use Aurora read replicas for read-heavy operations

## Security Best Practices

1. **Never commit `.env` file** - it's in `.gitignore`
2. **Use IAM authentication** for Aurora in production
3. **Enable SSL/TLS** for database connections
4. **Rotate credentials** regularly
5. **Use AWS Secrets Manager** for production credentials
