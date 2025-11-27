import fs from 'fs';
import path from 'path';

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
 * Parse a CSV line, handling quoted fields that may contain commas
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current);
    return result;
}

/**
 * Parse agencies CSV file
 */
export async function parseAgencies(): Promise<Agency[]> {
    const filePath = path.join(process.cwd(), 'app', 'data', 'agencies_agency_rows.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());

    if (lines.length === 0) return [];

    const headers = parseCSVLine(lines[0]);
    const agencies: Agency[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const agency: any = {};

        headers.forEach((header, index) => {
            agency[header] = values[index] || '';
        });

        agencies.push(agency as Agency);
    }

    return agencies;
}

/**
 * Parse contacts CSV file
 */
export async function parseContacts(): Promise<Contact[]> {
    const filePath = path.join(process.cwd(), 'app', 'data', 'contacts_contact_rows.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());

    if (lines.length === 0) return [];

    const headers = parseCSVLine(lines[0]);
    const contacts: Contact[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const contact: any = {};

        headers.forEach((header, index) => {
            contact[header] = values[index] || '';
        });

        contacts.push(contact as Contact);
    }

    return contacts;
}

/**
 * Get agency by ID
 */
export async function getAgencyById(agencyId: string): Promise<Agency | null> {
    const agencies = await parseAgencies();
    return agencies.find(agency => agency.id === agencyId) || null;
}
