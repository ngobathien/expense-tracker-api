import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from './enums/user-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // tạo user mới
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // lấy tất cả user
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.getAllUsers();
  }

  // GET PROFILE
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request & { user: { userId: string } }) {
    return {
      message: 'Get profile successfully',
      data: await this.usersService.getMe(req.user.userId),
    };
  }

  // UPDATE PROFILE
  @Put('me')
  @UseGuards(AuthGuard)
  async updateMe(
    @Req() req: Request & { user: { userId: string } },
    @Body() dto: UpdateUserDto,
  ) {
    return {
      message: 'Update profile successfully',
      data: await this.usersService.updateUser(req.user.userId, dto),
    };
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findByIdPublic(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
