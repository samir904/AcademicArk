// UTILS/activeResource.js
let activeResource = { type: null, id: null };

export const setActiveResource = ({ type, id }) => {
  activeResource = { type, id };
  console.log('active resource at time of calling the note reader page',activeResource)
};

export const clearActiveResource = () => {
  activeResource = { type: null, id: null };
  console.log('clear resurce at time of exit of read note page',activeResource);
};

export const getActiveResource = () => activeResource;