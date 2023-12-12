const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const checkTypeAvail = (type, typesDetail) => {
    const typeDetail = typesDetail.find((typeDetail) => typeDetail.name === type);
    if (typeDetail?.Time) {
        let { fromTime, toTime, fromDay, toDay } = typeDetail.Time;

        if (toTime === '0') {
            toTime = 24;
        }

        const currentDay = new Date().getDay();
        // Index of fromDay and toDay in day array
        const fromDayIndex = day.indexOf(fromDay);
        const toDayIndex = day.indexOf(toDay);

        if (currentDay >= fromDayIndex && currentDay <= toDayIndex) {
            const currentTime = new Date().getHours();
            if (currentTime >= fromTime && currentTime <= toTime) {
                return type;
            }
        }

        return '';
    }
    return type;
};

export default checkTypeAvail;
