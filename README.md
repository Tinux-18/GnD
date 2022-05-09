# Give and Donate

## Overview

Give and Donate (GnD) is a platform for buying donations, which hopes to turn into a small social enterprise in the near future.

Giving someone a gift is an act of care and compassion essential in our society. However, the making of physical gifts comes with a significant cost to our environment. When it’s not the right gift, returning, stacking it away and even worse disposing of it increases this cost exponentially.

We do not want to do away with gift giving, that is awesome, we just want to reduce its footprint while maintaining its magic. Thus, the idea of Give and Donate was born.

Our platform allows you to make a donation in the name of someone you care about and send them a gift card. You could donate to a cause close to their heart or that you, personally, care about.

This donation would help a small association in Romania do something good at the grass root level. From their perspective, GnD is another source of income they can easily access. And this is an important feature for us.

GnD’s goals are: very easy registration and administration for the NGOs and great design for the gift-givers.

## Notes

## Tried it yourself locally

**Requirements**: git, node, npm, postgreSQL

1. Clone the repo
2. Set-up your secrets.json file based on the
   [provided example](https://github.com/Tinux-18/Netoscope/blob/main/secrets_example.json)
3. Set-up your database with `createdb <database_name>`
4. Create the tables from
   [images.sql](https://github.com/Tinux-18/Netoscope/blob/main/sql/images.sql)
5. Install npm packages with `npm i`
6. Run the app locally with `node .`

## Techstack

This was my graduation project from the Spiced Academy full-stack web development bootcamp. I am to develop this project further and go live sometime in 2022.

### Front-end

![](https://img.shields.io/badge/-Vue.js-4FC08D?logo=Vue.js&logoColor=white)

### Back-end

![](https://img.shields.io/badge/-Node.js-339933?logo=Node.js&logoColor=white)&nbsp;![](https://img.shields.io/badge/-Express-000000?logo=Express&logoColor=white)&nbsp;![](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=PostgreSQL&logoColor=white)&nbsp;![](https://img.shields.io/badge/-AWS%20S3-569A31?logo=Amazon-S3&logoColor=white)

## Features

-   basicAuth
-   Upload image
-   Comment on image
-   Delete comments
-   Expand all comments
-   Infininte scroll

## Todo

-   improve image load speed
-   refactor UI with Grid
-   deploy to Heroku

## Preview

<img align="left" alt="linkedin" src="previews/netoscope_landing_preview.png" />
