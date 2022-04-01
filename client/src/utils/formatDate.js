exports.formatDate = (sqlDate) => {
    let dateParams = sqlDate.replace("T", " ").replace("Z", "").split(/[- :]/);
    let dateObj = new Date(
        Date.UTC(
            dateParams[0],
            dateParams[1] - 1,
            dateParams[2],
            dateParams[3],
            dateParams[4],
            dateParams[5]
        )
    );
    return dateObj.toLocaleString().replace(",", " at");
};

exports.formatDateForInputPopulation = (sqlDate) => {
    let dateParams = sqlDate.replace("T", " ").replace("Z", "").split(/[- :]/);
    return `${dateParams[0]}-${dateParams[1]}-${dateParams[2]}`;
};
