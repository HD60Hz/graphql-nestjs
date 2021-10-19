import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OnentLocation {
  @Field({ nullable: true })
  Code: string;

  @Field(() => Int, { nullable: true })
  SiteCodeLength: number;

  @Field(() => Int, { nullable: true })
  SiteId: number;

  @Field({ nullable: true })
  EmgName: string;

  @Field(() => Int, { nullable: true })
  StateId: number;

  @Field({ nullable: true })
  StateName: string;

  @Field(() => Int, { nullable: true })
  CountryId: number;

  @Field({ nullable: true })
  CountryName: string;

  @Field(() => Int, { nullable: true })
  CityBasarId: number;

  @Field({ nullable: true })
  CityName: string;

  @Field(() => Int, { nullable: true })
  CountyBasarId: number;

  @Field({ nullable: true })
  CountyName: string;

  @Field(() => Int, { nullable: true })
  BcoCompanyId: number;

  @Field({ nullable: true })
  BcoName: string;

  @Field(() => Int, { nullable: true })
  PlanningResponsibleUserId: number;

  @Field({ nullable: true })
  PlanningResponsibleUserName: string;

  @Field({ nullable: true })
  GatheringCenterTypeId: string;

  @Field({ nullable: true })
  GatheringCenterTypeName: string;

  @Field(() => Int, { nullable: true })
  RealMainRegionId: number;

  @Field({ nullable: true })
  RealMainRegionName: string;

  @Field(() => Int, { nullable: true })
  RealRegionId: number;

  @Field({ nullable: true })
  RealRegionName: string;
}
