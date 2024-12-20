export const validateEmail = (email: string) => {
  const validRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!email) {
    return "Email is required.";
  } else if (!validRegex.test(email)) {
    return "Please enter a valid email address";
  }
};

export const validatePassword = (password: string) => {
  if (!password) {
    return "Password is required.";
  } else if (password.length < 5) {
    return "Please enter a password that is at least 5 characters long";
  }
};
export const validateConfirmPassword = (confirmPassword: string) => {
  if (!confirmPassword) {
    return "Please enter your password.";
  } else if (confirmPassword.length < 5) {
    return "Please enter a password that is at least 5 characters long";
  }
};
export const validateFirstName = (firstName: string) => {
  if (!firstName) {
    return "FirstName is required.";
  }
};
export const validateLastName = (lastName: string) => {
  if (!lastName) {
    return "LastName is required.";
  }
};

export const validatePhone = (phone: string) => {
  const validPhone = /^\d{11}$/;
  if (!phone) {
    return "Phone number is required.";
  } else if (!validPhone.test(phone)) {
    return "Please enter a valid phone number";
  }
};

export const validateDepartment = (dept: string) => {
  if (!dept) {
    return "Please select a department";
  }
};
export const validateRole = (dept: string) => {
  if (!dept) {
    return "Please select a role";
  }
};

export const validateField = (fieldName: string, msg: string) => {
  if (!fieldName) {
    return msg;
  }
};

export const isValidImage = (url: string) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
};
