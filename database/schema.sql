-- Database schema for Agency Contact Dashboard
-- This schema matches the CSV structure

CREATE DATABASE IF NOT EXISTS agency_contact_db;
USE agency_contact_db;

-- Agencies table
CREATE TABLE IF NOT EXISTS agencies (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  state VARCHAR(100),
  state_code VARCHAR(2),
  type VARCHAR(100),
  population VARCHAR(20),
  website VARCHAR(255),
  total_schools VARCHAR(20),
  total_students VARCHAR(20),
  mailing_address TEXT,
  grade_span VARCHAR(50),
  locale VARCHAR(100),
  csa_cbsa VARCHAR(100),
  domain_name VARCHAR(255),
  physical_address TEXT,
  phone VARCHAR(50),
  status VARCHAR(50),
  student_teacher_ratio VARCHAR(20),
  supervisory_union VARCHAR(100),
  county VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_state (state),
  INDEX idx_type (type),
  INDEX idx_county (county)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  title VARCHAR(255),
  email_type VARCHAR(50),
  contact_form_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  agency_id VARCHAR(36),
  firm_id VARCHAR(36),
  department VARCHAR(100),
  INDEX idx_name (last_name, first_name),
  INDEX idx_email (email),
  INDEX idx_agency_id (agency_id),
  INDEX idx_department (department),
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Instructions for importing CSV data:
-- 
-- 1. Connect to your Aurora MySQL database:
--    mysql --local-infile=1 -h agency-contact-db.choeme4iywve.eu-central-1.rds.amazonaws.com -u admin -p
--
-- 2. Create the database and tables:
--    SOURCE schema.sql;
--
-- 3. Import agencies data:
--    LOAD DATA LOCAL INFILE 'app/data/agencies_agency_rows.csv'
--    INTO TABLE agencies
--    FIELDS TERMINATED BY ',' 
--    ENCLOSED BY '"'
--    LINES TERMINATED BY '\n'
--    IGNORE 1 ROWS;
--
-- 4. Import contacts data:
--    LOAD DATA LOCAL INFILE 'app/data/contacts_contact_rows.csv'
--    INTO TABLE contacts
--    FIELDS TERMINATED BY ',' 
--    ENCLOSED BY '"'
--    LINES TERMINATED BY '\n'
--    IGNORE 1 ROWS;
