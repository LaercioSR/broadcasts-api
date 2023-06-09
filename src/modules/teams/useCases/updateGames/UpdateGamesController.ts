import { Request, Response } from "express";
import { container } from "tsyringe";

import { CrawlerJob } from "@shared/jobs/CrawlerJob";
import { SaveBroadcastsJob } from "@shared/jobs/SaveBroadcastsJob";
import { SaveNBABroadcastsJob } from "@shared/jobs/SaveNBABroadcastsJob";

class UpdateGamesController {
  async handle(request: Request, response: Response): Promise<Response> {
    // eslint-disable-next-line no-promise-executor-return
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const saveNBABroadcastsJob = container.resolve(SaveNBABroadcastsJob);
    const crawlerJob = container.resolve(CrawlerJob);
    const saveBroadcastsJob = container.resolve(SaveBroadcastsJob);

    saveNBABroadcastsJob.run();
    crawlerJob.run();
    await sleep(120000);
    await saveBroadcastsJob.run();

    return response.status(204).send();
  }
}

export { UpdateGamesController };
