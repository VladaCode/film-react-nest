import {
  IsEmail,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO для отдельного билета (место)
 */
export class TicketDto {
  @IsString()
  film: string; // ID фильма

  @IsString()
  session: string; // ID сеанса

  @IsNumber()
  @Min(1)
  row: number; // Номер ряда

  @IsNumber()
  @Min(1)
  seat: number; // Номер места
}

/**
 * DTO для данных контакта
 */
export class ContactsDto {
  @IsEmail()
  email: string; // Email пользователя

  @IsString()
  phone: string; // Телефон пользователя
}

/**
 * DTO для создания заказа
 * соответствует интерфейсу Order из фронта
 */
export class CreateOrderDto extends ContactsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}
