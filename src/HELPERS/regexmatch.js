export function isEmail(string){
    return string.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
}

export function isValidPassword(password) {
  // Require at least one lowercase letter, one uppercase letter,
  // one digit, one non-alphanumeric character, and minimum length of 8
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
  return pattern.test(password);
}

