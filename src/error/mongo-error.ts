import BaseCustomError from "./base-error";
import { SerializedErrorOutput } from "./@types/serialized-error-output";
import { StatusCode } from "./../utils/status-code";

export class MongoDuplicateKeyError extends BaseCustomError {
  private field: string;
  private value: string;
  keyValue: any;

  constructor(field: string, value: string) {
    super(
      `Duplicate key error on field '${field}' with value '${value}'.`,
      StatusCode.BadRequest
    );
    this.field = field;
    this.value = value;

    Object.setPrototypeOf(this, MongoDuplicateKeyError.prototype);
  }

  getStatusCode(): number {
    return StatusCode.BadRequest;
  }

  serializeErrorOutput(): SerializedErrorOutput {
    return {
      errors: [
        {
          message: `The value '${this.value}' for the field '${this.field}' must be unique.`,
        },
      ],
    };
  }
}