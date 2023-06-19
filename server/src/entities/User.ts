import { IsEmail, Length } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import Post from './Post';
import Vote from './Vote';

@Entity('users')
export class User {
  @Index()
  @IsEmail(undefined, { message: '이메일 형식으로 입력해 주세요' })
  @Length(1, 255, { message: '이메일 주소는 비워둘 수 없습니다' })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 32, { message: '사용자 이름은 3자 이상 입력해주세요' })
  @Column()
  username: string;

  @Column()
  @Length(6, 255, { message: '비밀번호를 6자 이상 입력해주세요' })
  password: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
