const fs = require('fs');
const xml2js = require('xml2js');

// Replace this with the actual path to your XML file
const xmlFilePath = 'C:/Users/ermay/Desktop/Sudhanshu docs and codes/XML to JSON/Mean.20240517_124500.xml';
const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');

// const keyMappings = {
//   "Vpv": "PV Input Voltage", // inputVoltage
//   "Vac": "AC Voltage", // outputVoltage
//   "Tm": "Time", // timestamp
//   "Sac": "Apparent Power", // apparantPower
//   "TmsRmg": "Time until reconnection", // 
//   "Riso": "Insulation Resistance", // 
//   "Qac": "Reactive power in kVAr", // reactivePower
//   "P-WSpt": "Current power specification (Active Power limit)", //
//   "P-WModFailStt": "Errors and warnings relating to active power limitation", //
//   "Prio": "Priority of error message", // 
//   "Ppv": "PV power in kW", // inputPower
//   "PFExt": "Degree of overexcitation or underexcitation.", // 
//   "PF": "Current displacement power factor cos φ", // powerFactor
//   "Pac": "AC power in kW", // activePower
//   "Msg": "Error message", // error
//   "Mode": "Operating state of the inverter", // status
//   "Ipv": "PV current in Ampere", // inputCurrent
//   "Iac": "Grid current in Ampere", // outputCurrent
//   "h-Total": "Feed-in hours (feed-in time without waiting time) of the inverter, in h", //
//   "h-On": "Operating hours (feed-in time and waiting time) of the inverter, in h", // dailyRuntime
//   "h-HighV": "Operating hours at high DC voltage", // 
//   "GriSwStt": "State of the AC disconnection unit", //
//   "Fac": "Power frequency in Hz", // frequency
//   "ExlAnaInV1": "External voltage measurement in V", // 
//   "ExlAnaInCur1": "External current measurement in mA", //
//   "E-Total": "Total energy fed into the grid, in kWh", // dailyEnergy
//   "Error": "Localization of the error", //
//   "ErrNoFirst": "Error number of the first error", // 
//   "ErrNo": "Error number", //
//   "Dt": "Date", //
//   "Dsc": "Measure for error correction", //
//   "DOutMntSvc": "State of the signal light", //
//   "DInKeySwStrStp": "Status of key switch", //
//   "DInGfdi": "Status of GFDI", //
//   "DInExlStrStp": "Status of the remote shutdown unit", //
//   "Cntry": "Country setting or configured standard", // 
//   "CntHtCab2": "Operating hours of the heating element 2, in h",
//   "CntGfdiSw": "Number of GFDI trippings",
//   "CntFanHs": "Operating hours of the heat sink fan, in h",
//   "CntFanCab3": "Operating hours of the interior fan 3, in h",
//   "CntFanCab2": "Operating hours of the interior fan 2, in h",
//   "CntFanCab1": "Operating hours of the interior fan 1, in h",
//   "Type": "Device type", //
//   "Q-VArModStt": "Reactive Power Setpoint Status",
//   "Q-VArModFailStt": "Errors and warnings relating to the reactive power setpoint"
// };

const keyMappings = {
  "Vpv": "inputVoltage",
  "Vac": "outputVoltage",
  "Tm": "timestamp",
  "Sac": "apparantPower", 
  "Qac": "reactivePower",
  "Ppv": "inputPower",
  "PF": "powerFactor",
  "Pac": "activePower",
  "Msg": "error",
  "Mode": "status",
  "Ipv": "inputCurrent",
  "Iac": "outputCurrent",
  "h-On": "dailyRuntime",
  "Fac": "frequency",
  "E-Total": "dailyEnergy"
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
      // jsonOutput[mappedKey] = {
      //   first: parseFloat(item.First[0]),
      //   last: parseFloat(item.Last[0]),
      //   min: parseFloat(item.Min[0]),
      //   max: parseFloat(item.Max[0]),
      //   mean: parseFloat(item.Mean[0]),
      //   base: parseFloat(item.Base[0]),
      //   period: parseInt(item.Period[0], 10),
      //   timestamp: item.TimeStamp[0]
      // };
      if(mappedKey == "timestamp") {
        jsonOutput[mappedKey] = item.TimeStamp[0];
      }
      else {
        jsonOutput[mappedKey] = parseFloat(item.Last[0]);
      }
    }
  });

  // Save the JSON output to a different file
  const outputFilePath = 'C:/Users/ermay/Desktop/Sudhanshu docs and codes/Git/xml-to-json/output2.json';
  fs.writeFileSync(outputFilePath, JSON.stringify(jsonOutput, null, 2), 'utf-8');
  console.log(`JSON output saved to ${outputFilePath}`);
});
