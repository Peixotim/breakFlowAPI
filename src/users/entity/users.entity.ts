import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersRoles } from './users.roles';
import { EnterpriseEntity } from 'src/enterprise/entity/enterprise.entity';
import { IsCpf } from 'src/core/validators/is-cpf.validator';
import { PasswordResetEntity } from 'src/password-reset/entity/password-reset.entity';
import { EventsEntity } from 'src/events/entity/events.entity';
import { SquadEntity } from 'src/squads/entity/squads.entity';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  mail: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  @IsCpf()
  cpf: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', nullable: true })
  biography: string;

  @Column({ type: 'enum', enum: UsersRoles })
  role: UsersRoles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => EnterpriseEntity, (enterprise) => enterprise.users)
  enterprise: EnterpriseEntity;

  @OneToMany(() => PasswordResetEntity, (passwordReset) => passwordReset.user)
  codesOTP: PasswordResetEntity[];

  @ManyToMany(() => EventsEntity, (events) => events.users)
  events: EventsEntity[];

  @ManyToOne(() => SquadEntity, (squad) => squad.members)
  squad: SquadEntity;
}
