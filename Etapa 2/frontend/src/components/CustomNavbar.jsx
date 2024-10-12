import React from "react";
import { Navbar, Nav, Container} from 'react-bootstrap';
import { Link } from "react-router-dom";
import './styles/NavbarBI.css';

export function CustomNavbar({ nav_links = [{ name: "Predecir una muestra", url: "/Muestra" }, { name: "Reentrenar", url: "/Entrenamiento" }]}) {
    return (
        <Navbar expand="sm" className="custom-navbar">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="custom-logo">
                    <img src="/UNFPA_logo.png" alt="Logo" width="213" height="73" className="img-fluid" />
                </Navbar.Brand>
                </Container>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        {nav_links.map((link, index) => (
                            <Nav.Item key={index}>
                                <Link className="nav-link custom-links" to={link.url}>
                                    {link.name}
                                </Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </Navbar.Collapse>
        </Navbar>
    );
}