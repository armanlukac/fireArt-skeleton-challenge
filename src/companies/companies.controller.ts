import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthMiddleware } from '../auth/jwt-auth/jwt-auth.middleware';

@Controller('companies')
@UseGuards(JwtAuthMiddleware)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.createCompany(dto);
  }

  @Get('all')
  async getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (!page || !limit) {
      return this.companiesService.getAllCompanies();
    }

    return this.companiesService.getAllCompaniesPaginated(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 10,
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.companiesService.getCompanyById(id);
  }

  @Get()
  async search(@Query('query') query: string) {
    return this.companiesService.searchCompanies(query);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companiesService.updateCompany(id, dto);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return this.companiesService.softDeleteCompany(id);
  }

  @Delete(':id/permanent')
  async permanentDelete(@Param('id') id: string) {
    return this.companiesService.permanentDeleteCompany(id);
  }
}
