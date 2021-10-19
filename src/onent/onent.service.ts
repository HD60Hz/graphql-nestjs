import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { OnentLocation } from './dto/onent.location';

@Injectable()
export class OnentService {
  async findSiteLocations(): Promise<OnentLocation[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const entityManager = getManager('onent');
        let strQueryLocation = `SELECT * FROM (
                SELECT
                DISTINCT
                TOP 100
                CODE as Code, LEN(CODE) AS SiteCodeLength, SITE_ID as SiteId, EMG_NAME as EmgName
                , STATE_ID as StateId, STATE_NAME as StateName
                , COUNTRY_ID as CountryId, COUNTRY_NAME as CountryName
                , CITY_BASAR_ID as CityBasarId, CITY_NAME as CityName
                , COUNTY_BASAR_ID as CountyBasarId, COUNTY_NAME as CountyName
                , BCO_COMPANY_ID as BcoCompanyId, BCO_NAME as BcoName
                , PLANNING_RESPONSIBLE_USER_ID as PlanningResponsibleUserId, PLANNING_RESPONSIBLE_USER_NAME as PlanningResponsibleUserName
                , GATHERING_CENTER_TYPE_ID as GatheringCenterTypeId, GATHERING_CENTER_TYPE_NAME as GatheringCenterTypeName
                , REAL_MAIN_REGION_ID as RealMainRegionId, REAL_MAIN_REGION_NAME as RealMainRegionName, REAL_REGION_ID as RealRegionId, REAL_REGION_NAME as RealRegionName
                FROM ONENT.NEMS_LOCATION.SITE_EXTENDED_INFO AS A WITH(NOLOCK)
                WHERE IS_DELETED=0 AND COUNTRY_ID IS NOT NULL AND CITY_BASAR_ID IS NOT NULL AND COUNTY_BASAR_ID IS NOT NULL
                ) AS T
                WHERE SiteCodeLength=5
                ORDER BY Code`;

        let result = await entityManager.query(strQueryLocation);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}
