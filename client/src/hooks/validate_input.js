export function validateInput(requiredFields, values, setInputErrors) {
    setInputErrors([]);
    let inputErrors = [];
    Object.entries(values).forEach(([key, value]) => {
        if (!value && requiredFields.includes(key)) {
            inputErrors.push(key);
        }
    });
    setInputErrors(inputErrors);
}
