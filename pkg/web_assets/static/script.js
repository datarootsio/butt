document.addEventListener('alpine:init', () => {
  Alpine.store('job', {
    spec: null,
    jobName: null,
    jobRun: null,
    runId: null,

    fetchSpec: async function () {
      try {
        const response = await fetch(`/api/jobs/${this.jobName}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.spec = await response.json();
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },
    fetchJobRun: async function (runId) {
      try {
        const response = await fetch(`/api/jobs/${this.jobName}/runs/${runId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.jobRun = await response.json();
        console.log(this);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },
    init() {
      // get jobname from last part of url
      const {jobName, runId} = parseJobUrl(window.location.href);
      this.jobName = jobName;
      this.runId = runId === "latest" ? -1 : runId;

      this.fetchSpec();
      this.fetchJobRun(this.runId)
    }


  })

  Alpine.store('jobs', {
    jobs: null,


    fetchJobs: async function () {
      try {
        const response = await fetch('/api/jobs/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.jobs = await response.json();
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },

    init() {
      this.fetchJobs();

    }

  })

  Alpine.store('selectedJob', {
    jobName: null,


    set: function (jobName) {
      this.jobName = jobName;
    },
  })

})

function parseJobUrl(url) {
  // Using a regular expression to extract jobName and runId
  const regex = /\/jobs\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);

  if (match && match.length >= 3) {
    return {
      jobName: match[1],
      runId: match[2]
    };
  } else {
    return {
      error: "Invalid URL format"
    };
  }
}


function truncateDateTime(dateTimeStr) {
  // Regular expression to match the date and time up to the minute
  const regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/;

  // Extract the matched part
  const match = dateTimeStr.match(regex);
  return match ? match[1] : null;
}