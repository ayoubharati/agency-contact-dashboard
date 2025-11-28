import pool from './db';

export interface Agency {
    id: string;
    name: string;
    state: string;
    state_code: string;
    type: string;
    population: string;
    website: string;
    total_schools: string;
    total_students: string;
    mailing_address: string;
    grade_span: string;
    locale: string;
    csa_cbsa: string;
    domain_name: string;
    physical_address: string;
    phone: string;
    status: string;
    student_teacher_ratio: string;
    supervisory_union: string;
    county: string;
    created_at: string;
    updated_at: string;
}

export interface Contact {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    title: string;
    email_type: string;
    contact_form_url: string;
    created_at: string;
    updated_at: string;
    agency_id: string;
    firm_id: string;
    department: string;
}

/**
 * Fetch all agencies from database
 */
export async function getAgencies(): Promise<Agency[]> {
    const [rows] = await pool.query(`
        SELECT
            id as name,
            id as id,
            name as state,
            type as state_code,
            state as type,
            population,
            website,
            total_schools,
            total_students,
            mailing_address,
            grade_span,
            locale,
            csa_cbsa,
            domain_name,
            physical_address,
            phone,
            status,
            student_teacher_ratio,
            supervisory_union,
            county,
            created_at,
            updated_at
        FROM agencies
        ORDER BY id
    `);
    return rows as Agency[];
}

/**
 * Fetch all contacts from database
 */
export async function getContacts(): Promise<Contact[]> {
    const [rows] = await pool.query(`
        SELECT
            id,
            first_name,
            last_name,
            title as email,
            department as phone,
            email as title,
            phone as department,
            email_type,
            contact_form_url,
            created_at,
            updated_at,
            agency_id,
            firm_id
        FROM contacts
        ORDER BY last_name, first_name
    `);
    return rows as Contact[];
}

/**
 * Get agency by ID
 */
export async function getAgencyById(agencyId: string): Promise<Agency | null> {
    const [rows] = await pool.query(`
        SELECT
            id as name,
            id as id,
            name as state,
            type as state_code,
            state as type,
            population,
            website,
            total_schools,
            total_students,
            mailing_address,
            grade_span,
            locale,
            csa_cbsa,
            domain_name,
            physical_address,
            phone,
            status,
            student_teacher_ratio,
            supervisory_union,
            county,
            created_at,
            updated_at
        FROM agencies
        WHERE id = ?
    `, [agencyId]);
    const agencies = rows as Agency[];
    return agencies.length > 0 ? agencies[0] : null;
}

/**
 * Get contact by ID
 */
export async function getContactById(contactId: string): Promise<Contact | null> {
    const [rows] = await pool.query(`
        SELECT
            id,
            first_name,
            last_name,
            title as email,
            department as phone,
            email as title,
            phone as department,
            email_type,
            contact_form_url,
            created_at,
            updated_at,
            agency_id,
            firm_id
        FROM contacts
        WHERE id = ?
    `, [contactId]);
    const contacts = rows as Contact[];
    return contacts.length > 0 ? contacts[0] : null;
}

/**
 * Search agencies by name, state, type, or county
 */
export async function searchAgencies(searchTerm: string): Promise<Agency[]> {
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await pool.query(
        `SELECT
            id as name,
            id as id,
            name as state,
            type as state_code,
            state as type,
            population,
            website,
            total_schools,
            total_students,
            mailing_address,
            grade_span,
            locale,
            csa_cbsa,
            domain_name,
            physical_address,
            phone,
            status,
            student_teacher_ratio,
            supervisory_union,
            county,
            created_at,
            updated_at
        FROM agencies
        WHERE id LIKE ?
           OR name LIKE ?
           OR state LIKE ?
           OR county LIKE ?
        ORDER BY id`,
        [searchPattern, searchPattern, searchPattern, searchPattern]
    );
    return rows as Agency[];
}

/**
 * Search contacts by name, email, title, or department
 */
export async function searchContacts(searchTerm: string): Promise<Contact[]> {
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await pool.query(
        `SELECT
            id,
            first_name,
            last_name,
            title as email,
            department as phone,
            email as title,
            phone as department,
            email_type,
            contact_form_url,
            created_at,
            updated_at,
            agency_id,
            firm_id
        FROM contacts
        WHERE CONCAT(first_name, ' ', last_name) LIKE ?
           OR title LIKE ?
           OR email LIKE ?
           OR department LIKE ?
        ORDER BY last_name, first_name`,
        [searchPattern, searchPattern, searchPattern, searchPattern]
    );
    return rows as Contact[];
}
