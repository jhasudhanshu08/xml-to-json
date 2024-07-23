const fs = require('fs');
const xml2js = require('xml2js');

// Replace this with the actual path to your XML file
const xmlFilePath = 'C:/Users/ermay/Desktop/Sudhanshu docs and codes/XML to JSON/Mean.20240517_124500.xml';
const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');

const keyMappings = {
  "Vpv": "PV Input Voltage",
  "Vac": "AC Voltage",
  "Tm": "Time",
  "Sac": "Apparent Power",
  "TmsRmg": "Time until reconnection",
  "Riso": "Insulation Resistance",
  "Qac": "Reactive power in kVAr",
  "P-WSpt": "Current power specification (Active Power limit)",
  "P-WModFailStt": "Errors and warnings relating to active power limitation",
  "Prio": "Priority of error message",
  "Ppv": "PV power in kW",
  "PFExt": "Degree of overexcitation or underexcitation.",
  "PF": "Current displacement power factor cos φ",
  "Pac": "AC power in kW",
  "Msg": "Error message",
  "Mode": "Operating state of the inverter",
  "Ipv": "PV current in Ampere",
  "Iac": "Grid current in Ampere",
  "h-Total": "Feed-in hours (feed-in time without waiting time) of the inverter, in h",
  "h-On": "Operating hours (feed-in time and waiting time) of the inverter, in h",
  "h-HighV": "Operating hours at high DC voltage",
  "GriSwStt": "State of the AC disconnection unit",
  "Fac": "Power frequency in Hz",
  "ExlAnaInV1": "External voltage measurement in V",
  "ExlAnaInCur1": "External current measurement in mA",
  "E-Total": "Total energy fed into the grid, in kWh",
  "Error": "Localization of the error",
  "ErrNoFirst": "Error number of the first error",
  "ErrNo": "Error number",
  "Dt": "Date",
  "Dsc": "Measure for error correction",
  "DOutMntSvc": "State of the signal light",
  "DInKeySwStrStp": "Status of key switch",
  "DInGfdi": "Status of GFDI",
  "DInExlStrStp": "Status of the remote shutdown unit",
  "Cntry": "Country setting or configured standard",
  "CntHtCab2": "Operating hours of the heating element 2, in h",
  "CntGfdiSw": "Number of GFDI trippings",
  "CntFanHs": "Operating hours of the heat sink fan, in h",
  "CntFanCab3": "Operating hours of the interior fan 3, in h",
  "CntFanCab2": "Operating hours of the interior fan 2, in h",
  "CntFanCab1": "Operating hours of the interior fan 1, in h",
  "Type": "Device type",
  "Q-VArModStt": "Reactive Power Setpoint Status",
  "Q-VArModFailStt": "Errors and warnings relating to the reactive power setpoint"
};

xml2js.parseString(xmlContent, (err, result) => {
  if (err) {
    throw err;
  }

  // Dynamically extract the id from the first MeanPublic entry's Key
  let dynamicId = "";
  if (result.WebBox && result.WebBox.MeanPublic && result.WebBox.MeanPublic.length > 0) {
    const firstKey = result.WebBox.MeanPublic[0].Key[0];
    dynamicId = firstKey.split(':')[0] + ":" + firstKey.split(':')[1];
  }

  const jsonOutput = { id: dynamicId }; 

  result.WebBox.MeanPublic.forEach(item => {
    const key = item.Key[0];
    const keyParts = key.split(':');
    const mappedKey = keyMappings[keyParts[2]];
    if (mappedKey) {
      jsonOutput[mappedKey] = {
        first: parseFloat(item.First[0]),
        last: parseFloat(item.Last[0]),
        min: parseFloat(item.Min[0]),
        max: parseFloat(item.Max[0]),
        mean: parseFloat(item.Mean[0]),
        base: parseFloat(item.Base[0]),
        period: parseInt(item.Period[0], 10),
        timestamp: item.TimeStamp[0]
      };
    }
  });

  // Save the JSON output to a different file
  const outputFilePath = 'C:/Users/ermay/Desktop/Sudhanshu docs and codes/XML to JSON/output.json';
  fs.writeFileSync(outputFilePath, JSON.stringify(jsonOutput, null, 2), 'utf-8');
  console.log(`JSON output saved to ${outputFilePath}`);
});
