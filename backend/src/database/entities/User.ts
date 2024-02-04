import { Entity, Column, OneToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';
import { UserAuthSession } from './UserAuthSession';
import { Client } from './Client';
import { BaseEntity } from './Base';

@Entity('users')
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 25,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 25,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 51,
  })
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    length: 150,
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

  /**
   * Associations
   */
  @OneToOne(() => Client)
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
