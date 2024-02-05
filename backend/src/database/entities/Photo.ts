import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './Base';
import { Client } from './Client';

@Entity('photos')
export class Photo extends BaseEntity {
  @Column({
    length: 150,
    nullable: false,
  })
  name: string;

  @Column({
    length: 150,
    nullable: false,
  })
  url: string;

  /**
   * Associations
   */
  @ManyToOne(() => Client)
  @JoinColumn()
  client: Client;
}
