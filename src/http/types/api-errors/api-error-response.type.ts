type ErrorObject = {
    message: string;
    stack: string;
}

type ApiJsonErrorType = {
    error: ErrorObject
}

export default ApiJsonErrorType;