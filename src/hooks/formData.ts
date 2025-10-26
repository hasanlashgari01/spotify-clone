export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value instanceof File ? value : String(value));
  });

  return formData;
};
