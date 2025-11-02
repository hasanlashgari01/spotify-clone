export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // $ if (value = null) =>skip it with und or null
    if (value === undefined || value === null) return;

    // $ blob|file directly being appended
    if (value instanceof File) {
      if (value.size > 0) {
        formData.append(key, value);
      }
      return;
    }

    //$ Arrays
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v instanceof File) {
          if (v.size > 0) formData.append(`${key}[]`, v);
        } else {
          formData.append(`${key}[]`, String(v));
        }
      });
      return;
    }

    // $ other primitives(string,number,boolean)
    formData.append(key, String(value));
  });

  return formData;
};
