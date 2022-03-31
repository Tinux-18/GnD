import { useState } from "react";

export function useStatefulFiles(defaultValue) {
    const [fields, setFields] = useState(defaultValue);
    function fileUpdate({ target }) {
        if (target.files) {
            setFields({ ...fields, [target.name]: target.files[0] });
        }
    }
    return [fields, fileUpdate];
}
