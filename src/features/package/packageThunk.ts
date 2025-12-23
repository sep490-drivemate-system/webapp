import { HttpMethod } from "@/types/constants/httpMethod";
import { createThunk } from "../genericCreateThunk";
import { IInstructorPackages } from "@/types/instructor/instructor-management.types";
import {
  CreatePackageForm,
  DrivingSkill,
  GetPackagesParams,
  Package,
  PaginatedPackagesResponse,
  RoadType,
  createUpdateDrivingSkill,
} from "@/types/package/package.type";

export const PACKAGE_PATH = "package";

export const getListPackages = createThunk<
  PaginatedPackagesResponse,
  GetPackagesParams
>(HttpMethod.GET, "getListPackages", `${PACKAGE_PATH}`, {
  buildUrl: (payload) => {
    const params = new URLSearchParams();
    if (payload?.searchKey) params.append("SearchKey", payload.searchKey);
    if (payload?.allowSelfCar !== undefined)
      params.append("AllowSelfCar", payload.allowSelfCar.toString());
    if (payload?.roadTypes && payload.roadTypes.length > 0) {
      payload.roadTypes.forEach((roadType) => {
        params.append("RoadTypes", roadType);
      });
    }
    if (payload?.drivingSkills && payload.drivingSkills.length > 0) {
      payload.drivingSkills.forEach((skill) => {
        params.append("DrivingSkills", skill);
      });
    }
    if (payload?.pageNumber)
      params.append("PageNumber", payload.pageNumber.toString());
    if (payload?.pageSize)
      params.append("PageSize", payload.pageSize.toString());

    const queryString = params.toString();
    return `${PACKAGE_PATH}${queryString ? `?${queryString}` : ""}`;
  },
});

export const getInstructorPackages = createThunk<
  IInstructorPackages[],
  { id: string }
>(
  HttpMethod.GET,
  "getPackagesByInstructorId",
  `${PACKAGE_PATH}/instructor/:id`,
  {
    buildUrl: (payload) => `${PACKAGE_PATH}/instructor/${payload.id}`,
  }
);



export const createInstructorPackage = createThunk<
  boolean,
  CreatePackageForm
>(HttpMethod.POST, "createPackage", `${PACKAGE_PATH}`);

export const getRecommendedPackages = createThunk<Package[]>(
  HttpMethod.GET,
  "getRecommendedPackages",
  `${PACKAGE_PATH}/recommended`
);

export const getRoadTypes = createThunk<RoadType[]>(
  HttpMethod.GET,
  "road-type",
  `roadtypes`
);

type CreateRoadTypePayload = {
  name: string;
  description?: string | null;
};

type UpdateRoadTypePayload = {
  id: string;
  name: string;
  description?: string | null;
};

type DeleteRoadTypePayload = {
  id: string;
};

export const createRoadType = createThunk<RoadType, CreateRoadTypePayload>(
  HttpMethod.POST,
  "createRoadType",
  `roadtypes`,
  {
    buildBody: (payload) => ({
      name: payload.name,
      description: payload.description ?? null,
    }),
  }
);

export const updateRoadType = createThunk<RoadType, UpdateRoadTypePayload>(
  HttpMethod.PUT,
  "updateRoadType",
  `roadtypes/:id`,
  {
    buildUrl: (payload) => `roadtypes/${payload.id}`,
    buildBody: (payload) => ({
      name: payload.name,
      description: payload.description ?? null,
    }),
  }
);

export const deleteRoadType = createThunk<boolean, DeleteRoadTypePayload>(
  HttpMethod.DELETE,
  "deleteRoadType",
  `roadtypes/:id`,
  {
    buildUrl: (payload) => `roadtypes/${payload.id}`,
    buildBody: () => undefined,
  }
);

export const getDrivingSkills = createThunk<DrivingSkill[]>(
  HttpMethod.GET,
  "driving-skill",
  `skills`
);

type CreateDrivingSkillPayload = Pick<createUpdateDrivingSkill, "name">;
type UpdateDrivingSkillPayload = createUpdateDrivingSkill;
type DeleteDrivingSkillPayload = Pick<createUpdateDrivingSkill, "id">;

export const createDrivingSkill = createThunk<
  DrivingSkill,
  CreateDrivingSkillPayload
>(HttpMethod.POST, "createDrivingSkill", `skills`, {
  buildBody: (payload) => ({
    name: payload.name,
  }),
});

export const updateDrivingSkill = createThunk<
  DrivingSkill,
  UpdateDrivingSkillPayload
>(HttpMethod.PUT, "updateDrivingSkill", `skills/:id`, {
  buildUrl: (payload) => `skills/${payload.id}`,
  buildBody: (payload) => ({
    name: payload.name,
  }),
});

export const deleteDrivingSkill = createThunk<
  boolean,
  DeleteDrivingSkillPayload
>(HttpMethod.DELETE, "deleteDrivingSkill", `skills/:id`, {
  buildUrl: (payload) => `skills/${payload.id}`,
  buildBody: () => undefined,
});