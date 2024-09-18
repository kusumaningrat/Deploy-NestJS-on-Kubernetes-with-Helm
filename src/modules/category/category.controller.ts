import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('/api/category')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async getAll() {
        const categories = await this.categoryService.getAll()
        return {
            'message': 'Sucessfully load category',
            'data': categories
        }
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        const category = await this.categoryService.getOne(id)
        return {
            'message': 'Sucessfully load category',
            'data': category
        }
    }

    @Post()
    async create(@Body() categoryDto: CategoryDto) {
        const category = await this.categoryService.create(categoryDto);
        return {
            'message': 'Sucessfully create category',
            'data': category
        }
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() categoryDto: CategoryDto) {
        const category = await this.categoryService.update(id, categoryDto)
        console.log(category);
        return {
            'message': 'Sucessfully updated category',
            'data': category
        }
    }

    @Delete(':id')
    async destroy(@Param('id') id: number) {
        await this.categoryService.destroy(id);
        return {
            'message': 'Successfully delete category',
        }
    }
}
