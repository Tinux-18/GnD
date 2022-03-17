import { useState } from "react";

export function useStatefulFields(defaultValue) {
    const [fields, setFields] = useState(defaultValue);
    function inputUpdate({ target }) {
        setFields({ ...fields, [target.name]: target.value });
    }
    return [fields, inputUpdate];
}
