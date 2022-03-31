const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../../secrets.json");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "us-east-1",
});

exports.s3Upload = (req, res, next) => {
    if (req.files.length == 0) {
        console.log("multer failed");
        return res.sendStatus(500);
    }
    let promises = [];
    for (const file in req.files) {
        if (Object.hasOwnProperty.call(req.files, file)) {
            const { filename, mimetype, size, path } = req.files[file][0];
            promises.push(
                s3
                    .putObject({
                        Bucket: "constantin-portofolio",
                        ACL: "public-read",
                        Key: filename,
                        Body: fs.createReadStream(path),
                        ContentType: mimetype,
                        ContentLength: size,
                    })
                    .promise()
            );
        }
    }

    Promise.all(promises)
        .then(() => {
            next();
        })
        .catch((err) => {
            console.log(`s3 upload failed with: ${err}`);
            return res.sendStatus(500);
        });
};

exports.sendEmail = function (recipient, message, subject) {
    return ses
        .sendEmail({
            Source: "Constantin Rigu <constantin.c.rigu@gmail.com>",
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("SES sent mail succesfully!"))
        .catch((err) => console.log(`SES failed with: ${err}`));
};
