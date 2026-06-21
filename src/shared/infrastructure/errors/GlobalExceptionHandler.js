import { ZodError } from "zod";
import ProblemDetails from "./ProblemDetail.js";

class GlobalExceptionHandler {
  handle(error, req, res, next) {
    if (error instanceof ZodError) {
      return this.handleZodError(error, req, res);
    }

    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {

      return this.handleInvalidJson(req, res);
    }

    if (error.name === "AddressNotFoundException") {

      return this.handleNotFound(error, req, res);
    }

    if (error.name === "TokenExpiredError") {

      return this.handleTokenExpired(req, res);
    }

    if (error.name === "JsonWebTokenError") {

      return this.handleInvalidToken(req, res);
    }

    return this.handleUnexpectedError(error, req, res);
  }

  handleZodError(error, req, res) {
    const problem = new ProblemDetails(
      "https://api.example.com/errors/validation-error",
      "Validation Error",
      400,
      "One or more fields failed validation",
      req.path
    );

    return res.status(400).json({ ...problem, errors: error.issues });
  }

  handleInvalidJson(req, res) {
    const problem = new ProblemDetails(
      "https://api.example.com/errors/invalid-json",
      "Invalid JSON",
      400,
      "The request body contains malformed JSON",
      req.path
    );

    return res.status(400).json(problem);
  }

  handleNotFound(error, req, res) {
    const problem = new ProblemDetails(
      "https://api.example.com/errors/not-found",
      "Resource Not Found",
      404,
      error.message,
      req.path
    );

    return res.status(404).json(problem);
  }

  handleTokenExpired(req, res) {
    const problem = new ProblemDetails(
      "https://api.example.com/errors/token-expired",
      "Shared Link Expired",
      401,
      "The shared link token has expired",
      req.path
    );

    return res.status(401).json(problem);
  }

  handleInvalidToken(req, res) {
    const problem = new ProblemDetails(
      "https://api.example.com/errors/invalid-token",
      "Invalid Shared Link",
      401,
      "The shared link token is invalid",
      req.path
    );

    return res.status(401).json(problem);
  }

  handleUnexpectedError(error, req, res) {
    console.error(error);
    const problem = new ProblemDetails(
      "https://api.example.com/errors/internal-server-error",
      "Internal Server Error",
      500,
      "An unexpected error occurred",
      req.path
    );

    return res.status(500).json(problem);
  }
}

export default new GlobalExceptionHandler();