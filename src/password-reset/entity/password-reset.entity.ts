import { UsersEntity } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('password-reset')
export class PasswordResetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'int' })
  codeGenerator: number;

  @Column({ type: 'boolean' })
  used: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.codesOTP)
  user: UsersEntity;
}
