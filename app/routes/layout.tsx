import { Container } from "@mantine/core";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <Container mt={40} bg="#e7ecec">
      <Outlet />
    </Container>
  );
}
