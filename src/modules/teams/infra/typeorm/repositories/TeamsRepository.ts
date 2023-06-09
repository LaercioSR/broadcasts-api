import { Repository } from "typeorm";

import { ICreateTeamDTO } from "@modules/teams/dtos/ICreateTeamDTO";
import { ITeamsRepository } from "@modules/teams/repositories/ITeamsRepository";
import { AppError } from "@shared/errors/AppError";
import { AppDataSource } from "@shared/infra/typeorm/dataSource";

import { Game } from "../entities/Game";
import { Team } from "../entities/Team";

class TeamsRepository implements ITeamsRepository {
  private repository: Repository<Team>;

  constructor() {
    this.repository = AppDataSource.getRepository(Team);
  }

  async create({ name, logo }: ICreateTeamDTO): Promise<Team> {
    const teamAlreadyExists = await this.findByName(name);

    if (teamAlreadyExists) {
      return teamAlreadyExists;
    }

    const team = this.repository.create({ name, logo });

    await this.repository.save(team);

    return team;
  }

  async findByName(name: string): Promise<Team> {
    const team = await this.repository.findOne({ where: { name } });

    return team;
  }

  async findByQuery(query: string): Promise<Team> {
    const team = await this.repository
      .createQueryBuilder()
      .where("unaccent(name) LIKE unaccent(:query)", { query })
      .getOne();

    if (!team) {
      throw new AppError("Team not found!", 404);
    }

    return team;
  }

  async getGamesById(id: string): Promise<Game[]> {
    const games_home = await this.repository
      .createQueryBuilder()
      .relation("games_home")
      .of(id)
      .loadMany();
    const games_away = await this.repository
      .createQueryBuilder()
      .relation("games_away")
      .of(id)
      .loadMany();

    return [...games_home, ...games_away];
  }

  async find(): Promise<Team[]> {
    const teams = await this.repository.find({
      order: { name: { direction: "ASC" } },
    });

    return teams;
  }
}

export { TeamsRepository };
