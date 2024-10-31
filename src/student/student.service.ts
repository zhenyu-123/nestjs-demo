import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository, Like } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private readonly student: Repository<Student>,
  ) {}

  create(createStudentDto: CreateStudentDto) {
    const data = new Student();
    data.name = createStudentDto.name;
    data.desc = createStudentDto.desc;
    return this.student.save(data);
  }

  async findAll(query: { keyWord: string; page: number; pageSize: number }) {
    const data = await this.student.find({
      where: {
        name: Like(`%${query.keyWord}%`),
      },
      order: {
        id: 'DESC',
      },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    });
    const total = await this.student.count({
      where: {
        name: Like(`%${query.keyWord}%`),
      },
    });

    return {
      data,
      total,
    };
  }

  async findOne(id: number): Promise<Student | undefined> {
    return this.student.findOne({ where: { id } })
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return this.student.update(id, updateStudentDto);
  }

  remove(id: number) {
    return this.student.delete(id);
  }
}
