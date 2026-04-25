import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/common/entities/user.entity';
import { generateToken } from '../../common/utils/jwt.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //REGISTER
  async register(registerDto: RegisterDto) {

    // check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email:registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // create user
    const newUser = this.userRepository.create({
      name:registerDto.name,
      email:registerDto.email,
      password: hashedPassword,
      profileImage:registerDto.profileImage || '',
    });

    await this.userRepository.save(newUser);
    return {
      message: 'User registered successfully',
    };
  }

  // LOGIN
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
    };

    const access_token = generateToken(payload, 'WEB');

    return {
      message: 'Login successful',
      data:{
      access_token,
      user:{
        id:user.id,
        email:user.email,
        profileImage:user.profileImage
      },
    }
    };
  }
}