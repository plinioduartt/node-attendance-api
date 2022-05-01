type ApiJsonResponseListType<T> = {
    data: T[];
    limit?: number;
    offset?: number;
}

export default ApiJsonResponseListType;