/*
 *
 * All Rove exceptions should implement this interface.
 * RoveHttpException has extra httpCode.
 * RoveGrpcException has extra grpcCode.
 *
 * When mapping from a RoveGrpcException to a RoveHttpException, the message and code
 * remains the same, the name changes and grpcCode is mapped to httpCode.
 *
 */

export interface ExceptionInfo {
  code?: string; // Rove-specific code.
  metadata?: any;
}

export interface Exception {
  name: string; // Title of the error.
  message: string; // Details of the error.
  info: ExceptionInfo | null; // Extra info.
}
