import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GuildService {
    constructor(private readonly configService: ConfigService) {}
}
