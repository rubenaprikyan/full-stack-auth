import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { BaseEntity } from './Base';

@Entity('user-auth-sessions')
export class UserAuthSession extends BaseEntity {
  // later add device, and lastActive or something related to session
  @Column({ nullable: false })
  token: string;

  /**
   * Associations
   */
  @ManyToOne(() => User, user => user.authSessions)
  @JoinColumn()
  user: User;
}
