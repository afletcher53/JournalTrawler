import crossrefLogger from '../../loggers/crossref.logger';
import HttpStatusCode from '../Enums/HttpStatusCode.enum';

class HttpErrors {
  public handleError(error) {
    const { status } = error;

    switch (status) {
      case HttpStatusCode.INTERNAL_SERVER_ERROR: {
        this.generateError(error);
        break;
      }
      case HttpStatusCode.FORBIDDEN: {
        this.generateError(error);
        break;
      }
      case HttpStatusCode.UNAUTHORIZED: {
        this.generateError(error);
        break;
      }
      case HttpStatusCode.TOO_MANY_REQUESTS: {
        this.generateError(error);
        break;
      }
      case HttpStatusCode.NOT_FOUND: {
        this.generateError(error);
        break;
      }
      default:
        this.generateError(error);
    }

    return Promise.reject(error);
  }

  private generateError(error) {
    crossrefLogger.error(error);
    return crossrefLogger.error(
      `[${error.status}: ${error.config.method} ${error.config.url}:]`
    );
  }
}

export default HttpErrors;
