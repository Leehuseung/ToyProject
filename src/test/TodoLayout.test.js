import React from "react";
import { render } from "@testing-library/react";
import NotFound from "./NotFound";

describe("<NotFound />", () => {
    it("renders header", () => {
        const { getByText } = render(<NotFound path="/abc" />);
        const header = getByText("Page Not Found");
        expect(header).toBeInTheDocument();
    });
});