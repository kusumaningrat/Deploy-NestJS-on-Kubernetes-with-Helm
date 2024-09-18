import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
    ) {}

    async getAll(): Promise<Category[]> {
        const categories = await this.categoryRepository.find()
        return categories
    }

    async getOne(id: number): Promise<Category> {
        const getCategoryData = await this.categoryRepository.findOne({ where: { id: id }});
        if (!getCategoryData) {
            throw new NotFoundException('No Category Found')
        }
        return getCategoryData;
    }

    async create(categoryDto: CategoryDto): Promise<Category> {

        const checkExistingCategory = await this.categoryRepository.findOne({ where: { category_name: categoryDto.category_name }})

        // validate if it exist or now
        if (checkExistingCategory) {
            throw new ConflictException('Category already exist')
        }

        const category = await this.categoryRepository.save(categoryDto);
        return category
    }

    async update(id: number, category: Partial<Category>): Promise<Category> {
        const categoryData = await this.categoryRepository.findOne({ where: { id: id }});
    
        if (!categoryData) {
            throw new NotFoundException('No Category Found');
        }
    
        // Merge the existing data with the new data
        const updatedData = { ...categoryData, ...category };
    
        // Save the updated data
        await this.categoryRepository.save(updatedData);
    
        // Fetch the updated category
        const updatedCategory = await this.categoryRepository.findOne({ where: { id: id }});
    
        if (!updatedCategory) {
            throw new NotFoundException('Error updating the Category');
        }
    
        return updatedCategory;
    }
    
    async destroy(id: number): Promise<Category> {
        const categoryData = await this.categoryRepository.findOne({ where: { id: id }});
        if (!categoryData) {
            throw new NotFoundException('No Category Found');
        }
    
        await this.categoryRepository.remove(categoryData);
    
        return categoryData;
    }
}
