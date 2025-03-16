import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly db: DatabaseService) {}

  async createCompany(dto: CreateCompanyDto) {
    const result = await this.db.query(
      `INSERT INTO companies (name, contact, city, country, website) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [dto.name, dto.contact, dto.city, dto.country, dto.website],
    );
    return {
      message: 'Company created successfully',
      data: result.rows[0],
    };
  }

  async getAllCompanies() {
    const result = await this.db.query(
      `SELECT * FROM companies WHERE status = 1 ORDER BY created_at DESC`,
    );
    return {
      message: 'All companies',
      data: result.rows,
    };
  }

  async getAllCompaniesPaginated(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT * FROM companies WHERE status = 1 ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    // Get total count for pagination metadata
    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM companies WHERE status = 1`,
    );
    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      message: 'All companies (paginated)',
      data: result.rows,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async getCompanyById(id: string) {
    const result = await this.db.query(
      `SELECT * FROM companies WHERE id = $1 AND status = 1`,
      [id],
    );
    if (!result.rows.length) throw new NotFoundException('Company not found');
    return {
      message: 'Company found',
      data: result.rows[0],
    };
  }

  async searchCompanies(query: string) {
    const result = await this.db.query(
      `SELECT * FROM companies WHERE (name ILIKE $1 OR city ILIKE $1 OR country ILIKE $1 OR contact ILIKE $1) AND status = 1`,
      [`%${query}%`],
    );
    return {
      message: 'Search results',
      data: result.rows,
    };
  }

  async updateCompany(id: string, dto: UpdateCompanyDto) {
    const result = await this.db.query(
      `UPDATE companies SET 
       name = COALESCE($1, name),
       contact = COALESCE($2, contact),
       city = COALESCE($3, city),
       country = COALESCE($4, country),
       website = COALESCE($5, website),
       status = COALESCE($6, status),
       updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [
        dto.name,
        dto.contact,
        dto.city,
        dto.country,
        dto.website,
        dto.status,
        id,
      ],
    );
    if (!result.rows.length) throw new NotFoundException('Company not found');
    return {
      message: 'Company updated successfully',
      data: result.rows[0],
    };
  }

  async softDeleteCompany(id: string) {
    const result = await this.db.query(
      `UPDATE companies SET status = 0 WHERE id = $1 RETURNING *`,
      [id],
    );
    if (!result.rows.length) throw new NotFoundException('Company not found');
    return { message: 'Company deleted successfully' };
  }

  async permanentDeleteCompany(id: string) {
    const result = await this.db.query(
      `DELETE FROM companies WHERE id = $1 RETURNING *`,
      [id],
    );
    if (!result.rows.length) throw new NotFoundException('Company not found');
    return { message: 'Company permanently deleted' };
  }
}
