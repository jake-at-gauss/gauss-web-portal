const parseArrayFromCSV = (csv) => {
  const pattern = /(,|\n+|\r+|\t+)/gi;

  return csv.split(pattern).filter((txt) => !!txt && !txt.match(pattern));
};

const composePath = (path, args) => {
  return Object.entries(args).reduce((acc, [key, val]) => {
    return acc.replace(`:${key}`, val);
  }, path);
};

// TODO: account for ? params
const parsePath = (base) => {
  const args = base.split("/");
  return window.location.pathname.split("/").reduce((acc, segment, ind) => {
    return {
      ...acc,
      ...(segment !== args[ind] && {
        [`${args[ind].replace(":", "")}`]: segment,
      }),
    };
  }, {});
};

export { parseArrayFromCSV, composePath, parsePath };
