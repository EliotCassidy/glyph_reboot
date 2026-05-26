import bunyan from "bunyan";
import util from "util";

export class ErrorResolver {
  constructor({ log = bunyan({ name: "Death Node API", noop: true }) } = {}) {
    this.log = log.child({ service: "pdn-util-service" });
  }

  formatValidationError(error) {
    const errors = [];
    const message = error.message;

    if (error.name !== "ValidationError") {
      return error;
    }

    Object.keys(error.errors).forEach((field) => {
      const errorMessage = util.format(error.errors[field].message);
      errors.push(errorMessage);
    });

    return { errors, message };
  }
}

export default (options) => new ErrorResolver(options);
