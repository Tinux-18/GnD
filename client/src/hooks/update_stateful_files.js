import { useState } from "react";

export function useStatefulFiles(defaultValue) {
    const [files, setFields] = useState(defaultValue);
    function fileUpdate({ target }) {
        if (target.files) {
            setFields({ ...files, [target.name]: target.files[0] });
        }
    }
    return [files, fileUpdate];
}
