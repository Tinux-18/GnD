import { useState } from "react";

export function useStatefulFields(defaultValue) {
    const [fields, setFields] = useState(defaultValue);
    function inputUpdate({ target }) {
        setFields({ ...fields, [target.name]: target.value });
    }
    function updateAll(obj) {
        setFields({ ...obj });
    }
    function fileUpdate({ target }) {
        setFields({ ...fields, [target.name]: target.files[0] });
    }
    return [fields, fileUpdate, inputUpdate, updateAll];
}
