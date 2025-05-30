import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserProgress } from './user-progress.entity';
import { WalletInfo } from './wallet-info.entity'; // Ensure this import is present
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../enums/userRole.enum';
import { AccountStatus } from '../enums/accountStatus.enum';
import { UserProfile } from 'src/user-profiles/entities/user-profile.entity';
import { UserSettings } from './user-settings.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  isInstructor: boolean;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  // @Column({ nullable: true })
  // profilePicture: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @Column({ nullable: true })
  deactivatedAt: Date;

  @Column({ nullable: true })
  deletionRequestedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => UserProgress, (progress) => progress.user)
  progress: Promise<UserProgress[]>;

  @OneToOne(() => WalletInfo, (walletInfo) => walletInfo.user) // This defines the inverse relation
  walletInfo: WalletInfo;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToOne(() => UserSettings, (settings) => settings.user, {
    cascade: true,
    eager: true,
  })
  settings: UserSettings;

  async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}


