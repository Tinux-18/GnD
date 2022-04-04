// const db = require("../sql/db");

// async function init() {
//     let data = await db.getDonationsForNgo(29);
//     prepareTableInput(data.rows);
// }
// init();

exports.prepareTableInput = (data) => {
    data.map((donation) => {
        donation["donnor_name"] = `${donation.first} ${donation.last}`;
        donation["status"] = donation.accepted ? "Accepted" : "Pending";
        donation.created_at = formatDateForTable(donation.created_at + "");
    });
};

function formatDateForTable(sqlDate) {
    console.log("sqlDate :>> ", sqlDate);
    let dateParams = sqlDate.replace("T", " ").replace("Z", "").split(/[- :]/);
    console.log("dateParams :>> ", dateParams);
    return `${dateParams[1]} ${dateParams[2]} ${dateParams[3]}`;
}
