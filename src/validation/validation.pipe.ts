import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object') {
      throw new BadRequestException('Invalid input format');
    }

    for (const key in value) {
      if (typeof value[key] === 'string') {
        // Reject SQL injection patterns
        if (this.containsSQLInjection(value[key])) {
          throw new BadRequestException(`Invalid characters in field: ${key}`);
        }

        // Trim input to remove unnecessary spaces
        const trimmedValue = value[key].trim();
        value[key] = trimmedValue;
      }
    }

    return value;
  }

  private containsSQLInjection(input: string): boolean {
    const sqlInjectionPatterns = [
      /--/, // SQL comments
      /;/, // Multiple queries
      /' OR '/i, // OR-based injection
      /" OR "/i,
      /' AND '/i, // AND-based injection
      /" AND "/i,
      /DROP\s+TABLE/i, // DROP TABLE
      /SELECT\s+\*/i, // Unrestricted SELECT
      /INSERT\s+INTO/i, // INSERT queries
      /UPDATE\s+\w+\s+SET/i, // UPDATE queries
      /DELETE\s+FROM/i, // DELETE queries
      /UNION\s+SELECT/i, // UNION-based injection
    ];

    return sqlInjectionPatterns.some((pattern) => pattern.test(input));
  }
}
