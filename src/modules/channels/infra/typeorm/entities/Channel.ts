import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("channel")
export class Channel {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  logo?: string;

  @Column()
  source?: string;

  @Column()
  link?: string;

  @CreateDateColumn({
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;

  @UpdateDateColumn({ select: false })
  updated_at?: Date;

  @DeleteDateColumn({ select: false })
  deleted_at?: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
