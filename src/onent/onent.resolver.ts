import { OnentService } from './onent.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { OnentLocation } from './dto/onent.location';

@Resolver()
export class OnentResolver {
  constructor(private onentService: OnentService) {}

  @Query(() => [OnentLocation])
  async findSiteLocations(
    @Args('cityName', { nullable: false }) cityName: string,
  ) {
    return await this.onentService.findSiteLocations(cityName);
  }
}
