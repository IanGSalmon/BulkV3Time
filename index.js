// Packages
const fetch = require("node-fetch");
const FormData = require('form-data');

// Import env variables
const {BASE_URL, USER_SECRET, ORG_SECRET} = process.env;

// CHANGE THESE TO SUIT YOUR INSTANCE AND QUERY
const ELEMENT_KEY = "e9/T91CPdo0sZBJ2DWescQv7yYq9NVVQInN0sDLiBBI=";
const q = "SELECT * from defects WHERE LastUpdateDate>'2020-02-22T06:00:00'";
const pageSize = 200;

// Setting up call for POSTing new Bulk V3 job
const postBulkHeaders = {
    "Authorization": `User ${USER_SECRET}, Organization ${ORG_SECRET}, Element ${ELEMENT_KEY}`,
    "Accept": "application/json",
    "Elements-Version": "Helium"
};

const form = new FormData();
form.append("metaData", `{"pageSize": ${pageSize}}`);
const formHeaders = form.getHeaders();
Object.assign(postBulkHeaders, formHeaders);

const postOptions = {
  method: "POST",
  headers: postBulkHeaders,
  body: form
};

// Setting up call for GETing status on Bulk V3 job
const getStatusHeaders = {
  "Authorization": `User ${USER_SECRET}, Organization ${ORG_SECRET}, Element ${ELEMENT_KEY}`,
  "Content-Type": "application/json",
  "Accept": "application/json"
}

const getStatusOptions = {
  method: "GET",
  headers: getStatusHeaders
}

// URL for Bulk Job
const postBulkURL = `${BASE_URL}/elements/api-v2/bulk/query?q=${q}`;

// Delay between status checks
const timeout = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  })
}
// function to POST new Bulk V3 Job
function postNewBulk(url) {
  const start = new Date();
  return fetch(url, postOptions)
    .then(res => res.json())
    .then(async data => {
      if (data["status"] === "CREATED") {
        console.log("Bulk job started");
        const jobId = data["id"];
        console.log(`Job Id:  ${jobId}`);
        let running = true;
        let status;
        let recordsCount;
        while (running) {
          await timeout(3000);
          let data = await checkStatus(jobId);
          status = data.status;
          recordsCount = data.recordsCount;
          status === "COMPLETED" ? running = false : running = true;
          }

        const end = new Date();
        const callTime = (end - start)/1000;
        console.log(`Total time: ${callTime} seconds`);
        console.log(`Total records downloaded: ${recordsCount}`);
      }
    })
    .catch(err => console.log(err));
};

function checkStatus(id) {
  const statusURL = `${BASE_URL}/elements/api-v2/bulk/${id}/status`;
  return fetch(statusURL, getStatusOptions)
    .then(res => res.json())
    .then(data => {
      let dataObj = {
        status: data["status"],
        recordsCount: data["recordsCount"]
      }
      return dataObj;
    })
    .catch(err => console.log(err))
}

postNewBulk(postBulkURL);
