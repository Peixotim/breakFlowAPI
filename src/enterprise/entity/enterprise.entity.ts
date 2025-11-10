import { UsersEntity } from 'src/users/entity/users.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
@Entity({ name: 'enterprises' })
export class EnterpriseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255 })
  companyName: string;

  @Column({ type: 'varchar', length: 255 })
  fantasyName: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  cnpj: string;

  @Column({ type: 'int' })
  numberOfEmployees: number;

  @Column({ type: 'int' })
  numberOfSectors: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactMail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UsersEntity, (user) => user.enterprise)
  users: UsersEntity[];
}
