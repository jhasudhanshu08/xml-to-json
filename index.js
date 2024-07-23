const fs = require('fs');
const xml2js = require('xml2js');

const xmlFilePath = 'Mean.20240517_124500.xml'; // Replace with your XML file path
const outputFilePath = 'output.json'; // Path where you want to save the JSON output

// Function to parse XML and convert to JSON
function parseXML(xmlData) {
  let jsonData = {};

  xmlData.WebBox.MeanPublic.forEach((item) => {
    const key = item.Key[0]; // Get the Key value
    const parts = key.split(':');
    
    if (parts.length < 3) {
      return; // Skip if Key format is unexpected
    }

    // Extract id and label from Key
    const id = parts[0];
    const label = parts.slice(2).join(':'); // Join parts after 2nd ':'

    // Prepare the JSON structure as per your requirement
    if (!jsonData[id]) {
      jsonData[id] = {
        id: id,
      };
    }

    // Extract relevant data from MeanPublic
    const entry = {
      first: parseFloat(item.First[0]),
      last: parseFloat(item.Last[0]),
      min: parseFloat(item.Min[0]),
      max: parseFloat(item.Max[0]),
      mean: parseFloat(item.Mean[0]),
      base: parseInt(item.Base[0]),
      period: parseInt(item.Period[0]),
      timestamp: item.TimeStamp[0],
    };

    // Assign the entry to the appropriate key (label) in jsonData
    jsonData[id][label] = entry;
  });

  return jsonData;
}

// Read XML file
fs.readFile(xmlFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading XML file:', err);
    return;
  }

  // Parse XML to JSON
  xml2js.parseString(data, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }

    // Convert parsed XML data to structured JSON
    const jsonData = parseXML(result);

    // Convert JSON data to string format
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Write JSON string to output file
    fs.writeFile(outputFilePath, jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing JSON to file:', err);
        return;
      }
      console.log(`JSON data has been saved to ${outputFilePath}`);
    });
  });
});
