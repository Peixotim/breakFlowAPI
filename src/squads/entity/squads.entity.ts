import { EnterpriseEntity } from 'src/enterprise/entity/enterprise.entity';
import { UsersEntity } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'squads' })
export class SquadEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UsersEntity, (user) => user.squad)
  members: UsersEntity[];

  @ManyToOne(() => EnterpriseEntity, (enterprise) => enterprise.squads, {
    onDelete: 'CASCADE', //Se a empresa for deletada os squads serão tambem
  })
  enterprise: EnterpriseEntity;
}
