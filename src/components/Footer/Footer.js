import React from "react";
import {
  FooterContent,
  FooterContentWrapper,
  SocialGit,
  SocialLinkedin,
  StyledFooter,
} from "./FooterStyle";
import linkedinIcon from "../../images/linkedinIcon.svg";
import gitIcon from "../../images/githubIcon.svg";

const Footer = () => {
  return (
    <StyledFooter>
      <FooterContentWrapper>
        <FooterContent>FinPlannerLogo</FooterContent>
        <FooterContent> © 2023 - Marcos Moraes </FooterContent>
        <FooterContent>
          <SocialLinkedin src={linkedinIcon} />
          <SocialGit src={gitIcon} />
        </FooterContent>
      </FooterContentWrapper>
    </StyledFooter>
  );
};

export default Footer;
