import { Column, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { AppDataSource } from "../database";
import { UserGender } from "../enums";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "simple-enum", enum: UserGender })
    gender: UserGender;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    zipCode: string;

    @Column()
    city: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ type: "text"})
    password: string;

    @Column()
    lastLoginAt: Date;

}

export function userRepository(): Repository<User> {
    return AppDataSource?.getRepository(User) as Repository<User>;
}