import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsIn,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Priority } from '../entities/todo.entity';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'title tidak boleh kosong' })
  @IsString({ message: 'title harus berupa string' })
  @MaxLength(100, { message: 'title maksimal 100 karakter' })
  title: string;

  @IsOptional()
  @IsString({ message: 'description harus berupa string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'completed harus berupa boolean (true/false)' })
  completed?: boolean;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'], {
    message: 'priority harus salah satu dari: low, medium, high',
  })
  priority?: Priority;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'dueDate harus berformat tanggal ISO, contoh: 2026-07-01' },
  )
  dueDate?: string;
}
