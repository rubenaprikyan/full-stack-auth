import {
  BeforeInsert,
  ChildEntity,
  Column,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './User';
import { Photo } from './Photo';

@ChildEntity()
export class Client extends User {
  @Column({
    nullable: false,
    length: 150,
  })
  avatar: string;

  /**
   * Associations
   */
  @OneToMany(() => Photo, photo => photo.client, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  photos: Photo[];

  /**
   * Hooks
   */
  @BeforeInsert()
  updateAvatar() {
    this.avatar = 'avatars/default.jpeg';
  }
}
