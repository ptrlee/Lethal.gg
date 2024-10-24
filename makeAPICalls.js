async function getChampData(championName) {
    const url = `https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions/${championName}.json`;
    console.log(url)
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }
  
  console.log(getChampData("Ahri"))