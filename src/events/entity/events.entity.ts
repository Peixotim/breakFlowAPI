import { EnterpriseEntity } from 'src/enterprise/entity/enterprise.entity';
import { UsersEntity } from 'src/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class EventsEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  maxCapacity: number;

  @Column({ type: 'int', nullable: false })
  durationLimit: number;

  @Column({ type: 'varchar' })
  colorTheme: string;

  @ManyToMany(() => UsersEntity, (users) => users.events)
  @JoinTable()
  users: UsersEntity[];

  @ManyToOne(() => EnterpriseEntity, (enterprise) => enterprise.events)
  enterprise: EnterpriseEntity;
}
