type AttendanceEnumType = {
    status: {
        [key: string]: string;
    }
}

const attendanceEnums: AttendanceEnumType = {
    status: {
        OPENED: 'OPENED',
        CLOSED: 'CLOSED',
    }
};

export default attendanceEnums;