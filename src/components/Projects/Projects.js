import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { BsGithub } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";

// Define the API URL. Remember to change this to your deployed backend URL for production.
const API_URL = 'http://localhost:5000/api/projects';

// --- Sub-component: Particle ---
// This component was previously in a separate file (../Particle.js)
// It is now included here to resolve the import error.
function Particle() {
  return (
    <Particles
      id="tsparticles"
      params={{
        particles: {
          number: {
            value: 160,
            density: {
              enable: true,
              value_area: 1500,
            },
          },
          line_linked: {
            enable: false,
            opacity: 0.03,
          },
          move: {
            direction: "right",
            speed: 0.05,
          },
          size: {
            value: 1,
          },
          opacity: {
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.05,
            },
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: true,
              mode: "bubble",
            },
            onclick: {
              enable: true,
              mode: "repulse",
            },
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              size: 0,
              opacity: 0,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        retina_detect: true,
      }}
    />
  );
}

// --- Sub-component: ProjectCard ---
// This component was previously in a separate file (./ProjectCards.js)
// It is now included here to resolve the import error.
function ProjectCard(props) {
  return (
    <Card className="project-card-view">
      <Card.Img variant="top" src={props.imgPath} alt="card-img" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>
          {props.description}
        </Card.Text>
        <Button variant="primary" href={props.ghLink} target="_blank">
          <BsGithub /> &nbsp;
          {props.isBlog ? "Blog" : "GitHub"}
        </Button>
        {"\n"}
        {"\n"}

        {/* If the project is not a blog and has a demo link, show the Demo button */}
        {!props.isBlog && props.demoLink && (
          <Button
            variant="primary"
            href={props.demoLink}
            target="_blank"
            style={{ marginLeft: "10px" }}
          >
            <CgWebsite /> &nbsp;
            {"Demo"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}


// --- Main Component: Projects ---
function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {loading ? (
            <h2 style={{color: "white"}}>Loading Projects...</h2>
          ) : (
            projects.map((project) => (
              <Col md={4} className="project-card" key={project._id}>
                {/* Now using the locally defined ProjectCard component */}
                <ProjectCard
                  imgPath={project.image}
                  isBlog={false}
                  title={project.title}
                  description={project.description}
                  ghLink={project.githubLink}
                  demoLink={project.demoLink}
                />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
