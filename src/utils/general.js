const parseArrayFromCSV = (csv) => {
  const pattern = /(,|\n+|\r+|\t+)/gi;

  return csv.split(pattern).filter((txt) => !!txt && !txt.match(pattern));
};

export { parseArrayFromCSV };
