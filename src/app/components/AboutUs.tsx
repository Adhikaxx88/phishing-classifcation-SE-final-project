import type { CSSProperties } from "react";
import { Target, Zap, Shield, TrendingUp, Github as GithubIcon, ArrowUpRight } from "lucide-react";
import { GlitchText } from "./GlitchText";
import { NeonSeparator } from "./NeonSeparator";
import { CollaboratorCard } from "./CollaboratorCard";

const features = [
  {
    icon: <Target size={20} color="#00ff9d" aria-hidden="true" />,
    title: "Accurate Predictions",
    description:
      "A deep-learning model analyzes URL patterns to help identify potentially malicious links.",
  },
  {
    icon: <Zap size={20} color="#00ff9d" aria-hidden="true" />,
    title: "Fast Analysis",
    description:
      "Submit a URL and receive an analysis result in seconds, without a complicated workflow.",
  },
  {
    icon: <Shield size={20} color="#00ff9d" aria-hidden="true" />,
    title: "Security Awareness",
    description:
      "Understand the potential risks of a link before deciding whether to open it.",
  },
  {
    icon: <TrendingUp size={20} color="#00ff9d" aria-hidden="true" />,
    title: "Continuous Improvement",
    description:
      "The project can be extended with updated data and models as phishing techniques evolve.",
  },
];

const collaborators = [
  {
    name: "Adhikaxx88",
    role: "Adhika Gunawan 2802438205",
    description:
      "Backend Developer and AI Engineer - Developed the core deep-learning model and backend infrastructure for phishing URL analysis.",
  },
  {
    name: "Alvin",
    role: "Alvin Wijaya 2802393062",
    description:
      "UI/UX Designer - Designed the interface and user experience for the phishing detection system.",
  },
  {
    name: "Felix",
    role: "Felix Yung 2802394462",
    description:
      "Frontend Developer - Implemented the responsive interface, focusing on usability and visual consistency.",
  },
  {
    name: "Daniel",
    role: "Daniel Sebastian Winata 2802392652",
    description:
      "UI/UX Designer - Contributed to the interface and user experience to make the application clear and intuitive.",
  },
  {
    name: "Andrewyungg",
    role: "Andrew Yung 2802394424",
    description:
      "Frontend Developer - Developed frontend components and interactions to help users navigate the phishing detection tool.",
  },
  {
    name: "Tokesi",
    role: "Tokesi Lukynawa 2802394525",
    description:
      "UI/UX Designer - Contributed to the visual design and user experience of the application.",
  },
];

const panelStyle: CSSProperties = {
  background: "rgba(8, 18, 18, 0.72)",
  border: "1px solid rgba(0, 255, 157, 0.16)",
  borderRadius: 16,
  padding: 20,
  minWidth: 0,
};

export function AboutUs() {
  return (
    <main
      style={{
        background: "#0a0f0f",
        minHeight: "100%",
        padding: "clamp(20px, 4vw, 40px) clamp(16px, 3vw, 28px)",
        fontFamily: "monospace",
        color: "#e0e0e0",
      }}
    >
      <div style={{ maxWidth: 1152, margin: "0 auto", width: "100%" }}>
        <header style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(0,255,157,0.25)",
              borderRadius: 999,
              padding: "6px 12px",
              color: "#00ff9d",
              fontSize: 10,
              letterSpacing: "0.14em",
              marginBottom: 16,
            }}
          >
            <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 8px #00ff9d" }} />
            PHISHING DETECTION SYSTEM
          </div>
          <GlitchText
            text="About PhishGuard"
            style={{
              display: "block",
              fontSize: "clamp(25px, 4vw, 36px)",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1.2,
            }}
          />
          <p
            style={{
              color: "rgba(0,255,255,0.58)",
              fontSize: 11,
              letterSpacing: "0.18em",
              marginTop: 10,
              lineHeight: 1.7,
            }}
          >
            A URL ANALYSIS TOOL DESIGNED TO HELP USERS RECOGNIZE PHISHING THREATS
          </p>
          <NeonSeparator />
        </header>

        <section
          aria-label="Project overview and features"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={{ ...panelStyle, display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <h2 style={{ color: "#00ff9d", fontSize: 13, letterSpacing: "0.16em", margin: "0 0 10px" }}>
                PROJECT OVERVIEW
              </h2>
              <p style={{ color: "rgba(224,224,224,0.76)", fontSize: 13, lineHeight: 1.9, margin: 0 }}>
                PhishGuard is a phishing detection project that analyzes submitted URLs
                and uses a deep-learning model to identify links that may be malicious.
                It aims to make checking suspicious links more accessible through a
                straightforward interface.
              </p>
            </div>

            <NeonSeparator label="OUR MISSION" />
            <p style={{ color: "rgba(224,224,224,0.76)", fontSize: 13, lineHeight: 1.9, margin: 0 }}>
              Our mission is to help people make safer decisions online by providing
              an approachable way to assess suspicious URLs and understand potential
              phishing risks.
            </p>

            <NeonSeparator label="WHAT WE OFFER" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
                gap: 12,
              }}
            >
              {features.map((feature) => (
                <article
                  key={feature.title}
                  style={{
                    background: "rgba(0,255,157,0.035)",
                    border: "1px solid rgba(0,255,157,0.13)",
                    borderRadius: 12,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 9,
                      background: "rgba(0,255,157,0.08)",
                      border: "1px solid rgba(0,255,157,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 style={{ color: "#e0e0e0", fontSize: 12, margin: 0 }}>{feature.title}</h3>
                  <p style={{ color: "rgba(224,224,224,0.58)", fontSize: 11, lineHeight: 1.7, margin: 0 }}>
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div style={{ ...panelStyle, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h2 style={{ color: "#00ff9d", fontSize: 13, letterSpacing: "0.16em", margin: "0 0 6px" }}>
                THE TEAM
              </h2>
              <p style={{ color: "rgba(224,224,224,0.5)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                The people behind the PhishGuard project.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
                gap: 12,
              }}
            >
              {collaborators.map((person) => (
                <CollaboratorCard
                  key={person.name}
                  name={person.name}
                  role={person.role}
                  description={person.description}
                />
              ))}
            </div>
            <a
              href="https://github.com/Adhikaxx88/hci-url-phising-classification"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(0,255,157,0.07)",
                border: "1px solid rgba(0,255,157,0.3)",
                color: "#00ff9d",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
              }}
            >
              <GithubIcon size={16} aria-hidden="true" />
              View Project on GitHub
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
