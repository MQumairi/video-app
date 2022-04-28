//Takes two objects: original and request.
//Iterates over the properties of original.
//If a corresponding property in request exists, map it to original
//Else, leave original unchanged
//Return modified original

const EditMapper = (original: any, request: any) => {
  Object.keys(original).forEach((key: string) => {
    if (request[key] != null) {
      original[key] = request[key];
    }
  });
  return original;
};

export default EditMapper;