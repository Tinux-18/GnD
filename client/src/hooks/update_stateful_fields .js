import { useState } from "react";

export function useStatefulFields(defaultValue) {
    const [fields, setFields] = useState(defaultValue);
    function inputUpdate({ target }) {
        if (target) {
            setFields({ ...fields, [target.name]: target.value });
        }
    }
    function updateAll(obj) {
        setFields({ ...obj });
    }
    return [fields, inputUpdate, updateAll];
}
