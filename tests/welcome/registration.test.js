/* eslint-disable no-undef */
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MemoryRouter } from "react-router-dom";
import SignIn from "../../client/src/auth/registration";

test("Registration should render", () => {
    const { container } = render(
        <MemoryRouter>
            <SignIn />
        </MemoryRouter>
    );
    expect(
        container.querySelector("#registration-form h2").innerHTML
    ).toBeTruthy();
});

test("Redirect upon successful registration", async () => {
    const location = window.location;
    delete window.location;
    window.location = {
        ...location,
        reload: jest.fn(),
    };

    fetch.mockResolvedValueOnce({
        async json() {
            return {
                success: true,
            };
        },
    });

    const { container } = render(
        <MemoryRouter>
            <SignIn />
        </MemoryRouter>
    );
    userEvent.type(container.querySelector("#first"), "Muster");
    userEvent.type(container.querySelector("#second"), "Mustermann");
    userEvent.type(container.querySelector("#email"), "test@mail.com");
    userEvent.type(container.querySelector("#pass1"), "abc");
    userEvent.type(container.querySelector("#pass2"), "abc");
    fireEvent.click(container.querySelector("button"));

    await waitFor(() => {
        expect(window.location.reload).toHaveBeenCalledTimes(1);
        jest.restoreAllMocks();
        window.location = location;
    });
});

describe("Password Confirmation", () => {
    test("Password confirmation is visible", () => {
        const { container } = render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        userEvent.type(container.querySelector("#pass1"), "123456");
        // console.log(container.querySelector("#pass1"));
        expect(container.querySelector("#pass2")).toBeTruthy();
    });

    test("Password confirmation is hidden", () => {
        const { container } = render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        expect(container.querySelector("#pass2")).toBeFalsy();
    });
});

describe("Error rendering", () => {
    test("Empty field error shown", () => {
        const { container } = render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        userEvent.type(container.querySelector("#email"), "test@mail.com");
        fireEvent.click(container.querySelector("button"));

        expect(container.querySelector("#error").innerHTML).toContain(
            "Please fill in the required fields"
        );
    });

    test("General error shown upon failed fetch", async () => {
        fetch.mockResolvedValueOnce({
            async json() {
                return {
                    success: false,
                };
            },
        });

        const { container } = render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );
        userEvent.type(container.querySelector("#first"), "Muster");
        userEvent.type(container.querySelector("#second"), "Mustermann");
        userEvent.type(container.querySelector("#email"), "test@mail.com");
        userEvent.type(container.querySelector("#pass1"), "abc");
        userEvent.type(container.querySelector("#pass2"), "abc");
        fireEvent.click(container.querySelector("button"));

        await waitFor(() =>
            expect(container.querySelector("#error").innerHTML).toContain(
                "Something went wrong"
            )
        );
    });

    test("General error shown upon mismatched passwords", async () => {
        const { container } = render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );
        userEvent.type(container.querySelector("#first"), "Muster");
        userEvent.type(container.querySelector("#second"), "Mustermann");
        userEvent.type(container.querySelector("#email"), "test@mail.com");
        userEvent.type(container.querySelector("#pass1"), "abc");
        userEvent.type(container.querySelector("#pass2"), "ccc");
        fireEvent.click(container.querySelector("button"));

        expect(container.querySelector("#error").innerHTML).toContain(
            "Something went wrong"
        );
    });
});
// Implementation wiht renderrer
// import renderer from "react-test-renderer";

// test("Registration should render", () => {
//     const component = renderer
//         .create(
//             <MemoryRouter>
//                 <SignIn />
//             </MemoryRouter>
//         )
//         .toJSON();
//     expect(component).toMatchSnapshot();
// });
