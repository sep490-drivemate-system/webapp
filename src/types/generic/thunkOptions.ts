import { GenericResponse } from "./genericResponse";

export interface ThunkOptions<RequestType, ResponseType = void> {
  buildUrl?: (payload: RequestType) => string;
  buildBody?: (payload: RequestType) => unknown;
  config?: (payload: RequestType) => object;
  onSuccess?: (
    response: GenericResponse<ResponseType>,
    payload: RequestType
  ) => void;
  onError?: (error: unknown, payload: RequestType) => void;
  onFinally?: (payload: RequestType) => void;
}
