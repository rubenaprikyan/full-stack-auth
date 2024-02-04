import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './User';
import { BaseEntity } from './Base';
import { Photo } from './Photo';

@Entity('clients')
export class Client extends BaseEntity {
  @Column({
    nullable: false,
    length: 150,
  })
  avatar: string;

  /**
   * Associations
   */
  @OneToOne(() => User, (user: User) => user.client, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Photo, photo => photo.client, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  photos: Photo[];
}
