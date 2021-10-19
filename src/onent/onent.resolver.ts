import { OnentService } from './onent.service';
import { Query, Resolver } from '@nestjs/graphql';
import { OnentLocation } from './dto/onent.location';

@Resolver()
export class OnentResolver {
  constructor(private onentService: OnentService) {}

  @Query(() => [OnentLocation])
  async findSiteLocations() {
    let result = await this.onentService.findSiteLocations();
    return result;
  }
}
