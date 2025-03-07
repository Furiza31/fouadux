function processDataV1(csvText) {
  const result = [];
  const lines = csvText.trim().split("\n");
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const obj = {
      username: values[0],
      realName: values[1],
      website: values[2] || null,
      projectName: values[3]
    };
    result.push(obj);
  }
  return result;
}

const processDataV2 = (csvText) => {
  return csvText.trim().split("\n").slice(1).map(line => line.split(",")).map(values => ({
    username: values[0],
    realName: values[1],
    website: values[2] || null,
    projectName: values[3]
  }));
}


function stats(csvText) {
  const data = processDataV2(csvText);

  const FirstProject = [...new Set(data.map(d => d.projectName))]
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))[0];

  const UniqueContributors = [...new Set(data.map(d => d.realName))].length;

  const uniqueNames = [...new Set(data.map(d => d.realName))];
  const AverageContributors = uniqueNames.reduce((acc, name) => acc + name.length, 0) / uniqueNames.length;

  const contributorActivity = data.reduce((acc, d) => {
    acc[d.realName] = (acc[d.realName] || 0) + 1;
    return acc;
  }, {});

  const MostActiveContributor = Object.entries(contributorActivity)
    .sort((a, b) => b[1] - a[1])[0][0];

  const projectContributions = data.reduce((acc, d) => {
    acc[d.projectName] = (acc[d.projectName] || 0) + 1;
    return acc;
  }, {});
  const Top10Projects = Object.entries(projectContributions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);

  return {
    FirstProject,
    UniqueContributors,
    AverageContributors,
    MostActiveContributor,
    Top10Projects
  }
}

// fetch("http://localhost:3000/data.csv")
//   .then(response => response.text())
//   .then(processDataV1)
//   .then(console.log)
//   .catch(console.log)

// fetch("http://localhost:3000/data.csv")
//   .then(response => response.text())
//   .then(processDataV2)
//   .then(console.log)
//   .catch(console.log)

// fetch("http://localhost:3000/data.csv")
//   .then(response => response.text())
//   .then(stats)
//   .then(console.log)
//   .catch(console.log)

const analyzeCsv = async () => {
  const response = await fetch("http://localhost:3000/data.csv")
  const text = await response.text()
  return stats(text)
}


export {
  analyzeCsv, processDataV2 as processDataFunc, processDataV1 as processDataImp, processDataV1,
  processDataV2, stats
};

