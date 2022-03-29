import { useState } from "react";

export function useStatefulFields(defaultValue) {
    const [fields, setFields] = useState(defaultValue);
    function inputUpdate({ target }) {
        setFields({ ...fields, [target.name]: target.value });
    }
    function updateUserId(value) {
        setFields({ ...fields, userId: value });
    }
    return [fields, inputUpdate, updateUserId];
}
