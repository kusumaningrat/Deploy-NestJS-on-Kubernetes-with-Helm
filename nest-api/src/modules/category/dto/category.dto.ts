import { IsNotEmpty, IsString } from "class-validator";

export class CategoryDto {

    @IsString()
    @IsNotEmpty()
    category_name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}