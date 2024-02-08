import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  Unique,
} from 'typeorm';
import { UserAuthSession } from './UserAuthSession';
import { Client } from './Client';
import { BaseEntity } from './Base';
import { Length } from 'class-validator';

@Entity('users')
@Unique('email_unique', ['email'])
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 20,
  })
  @Length(2, 20, { message: 'First Name should be between 2 and 20 characters' })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  lastName: string;

  @Column({
    length: 50,
    type: 'varchar',
  })
  fullName: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    length: 150,
    nullable: false,
  })
  password: string;

  @Column({
    default: true,
  })
  active: boolean;

  @Column({
    default: 'user',
  }) // Default role is 'user'
  role: string;

  @Column({
    length: 32,
    nullable: false,
  })
  accessTokenSalt: string;

  /**
   * Associations
   */
  @OneToOne(() => Client, (client: Client) => client.user)
  @JoinColumn()
  client: Client;

  @OneToMany(() => UserAuthSession, authSession => authSession.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  authSessions: UserAuthSession[];

  /**
   * Hooks
   */
  @BeforeInsert()
  updateFullName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
