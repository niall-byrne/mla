import checkBillboardTitle from "@cypress/fixtures/spec/responsiveness/billboard.spec";
import checkDialogueToggle from "@cypress/fixtures/spec/responsiveness/dialogue.spec";
import { setup } from "@cypress/fixtures/spec/setup.spec";
import legal from "@locales/legal.json";
import routes from "@src/config/routes";

describe("Terms of Use Page", () => {
  const timeout = 5000;

  before(() => {
    setup();
    cy.visit(routes.legal.terms);
  });

  it("should render the title correctly", () => {
    cy.contains(legal.termsOfService.title).should("be.visible", { timeout });
  });

  it("should render the terms of service text correctly", () => {
    cy.contains(legal.termsOfService.text1.replace("  ", " ")).should(
      "be.visible"
    );
    cy.contains(legal.termsOfService.text2).should("be.visible");
  });

  checkBillboardTitle({ timeout, titleText: legal.termsOfService.title });
  checkDialogueToggle({
    timeout,
    toggleText: legal.termsOfService.company,
  });
});
