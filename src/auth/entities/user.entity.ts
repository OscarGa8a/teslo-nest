import {
  AfterInsert,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  fullName: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.setEmailToLowerCase();
  }

  @AfterInsert()
  checkFieldsAfterInsert() {
    this.setEmailToLowerCase();
  }

  private setEmailToLowerCase() {
    this.email = this.email.toLowerCase().trim();
  }
}
